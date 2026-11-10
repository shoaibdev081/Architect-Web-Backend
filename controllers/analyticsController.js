const Project = require('../models/Project');
const Service = require('../models/Service');
const Team = require('../models/Team');
const ClientReview = require('../models/ClientReview');
const Blog = require('../models/Blog');

// Helper function to get month name from date
const getMonthName = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()];
};

// Helper function to get day name from date
const getDayName = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

// Get overview statistics (counts for summary cards)
exports.getOverviewStats = async (req, res, next) => {
  try {
    const [projectsCount, servicesCount, teamCount, reviewsCount, blogsCount] = await Promise.all([
      Project.countDocuments(),
      Service.countDocuments(),
      Team.countDocuments(),
      ClientReview.countDocuments(),
      Blog.countDocuments()
    ]);

    // Calculate trends (compare with last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [lastMonthProjects, lastMonthServices, lastMonthReviews, lastMonthBlogs] = await Promise.all([
      Project.countDocuments({ createdAt: { $gte: lastMonth } }),
      Service.countDocuments({ createdAt: { $gte: lastMonth } }),
      ClientReview.countDocuments({ createdAt: { $gte: lastMonth } }),
      Blog.countDocuments({ createdAt: { $gte: lastMonth } })
    ]);

    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 2);

    const [prevMonthProjects, prevMonthServices, prevMonthReviews, prevMonthBlogs] = await Promise.all([
      Project.countDocuments({ createdAt: { $gte: previousMonth, $lt: lastMonth } }),
      Service.countDocuments({ createdAt: { $gte: previousMonth, $lt: lastMonth } }),
      ClientReview.countDocuments({ createdAt: { $gte: previousMonth, $lt: lastMonth } }),
      Blog.countDocuments({ createdAt: { $gte: previousMonth, $lt: lastMonth } })
    ]);

    // Calculate percentage changes
    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '+0%';
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`;
    };

    res.status(200).json({
      success: true,
      data: {
        counts: {
          projects: projectsCount,
          services: servicesCount,
          team: teamCount,
          reviews: reviewsCount,
          blogs: blogsCount
        },
        trends: {
          projects: calculateTrend(lastMonthProjects, prevMonthProjects),
          services: calculateTrend(lastMonthServices, prevMonthServices),
          reviews: calculateTrend(lastMonthReviews, prevMonthReviews),
          blogs: calculateTrend(lastMonthBlogs, prevMonthBlogs),
          team: '+5%' // Static for team as it doesn't change frequently
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get monthly growth data for the last 6 months
exports.getMonthlyGrowth = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [projects, services, reviews] = await Promise.all([
      Project.find({ createdAt: { $gte: sixMonthsAgo } }),
      Service.find({ createdAt: { $gte: sixMonthsAgo } }),
      ClientReview.find({ createdAt: { $gte: sixMonthsAgo } })
    ]);

    // Initialize monthly data
    const monthlyData = [];
    const currentMonth = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentMonth);
      month.setMonth(month.getMonth() - i);
      const monthName = getMonthName(month);
      
      monthlyData.push({
        month: monthName,
        projects: 0,
        services: 0,
        reviews: 0
      });
    }

    // Count projects by month
    projects.forEach(project => {
      const monthIndex = monthlyData.findIndex(item => item.month === getMonthName(project.createdAt));
      if (monthIndex !== -1) {
        monthlyData[monthIndex].projects++;
      }
    });

    // Count services by month
    services.forEach(service => {
      const monthIndex = monthlyData.findIndex(item => item.month === getMonthName(service.createdAt));
      if (monthIndex !== -1) {
        monthlyData[monthIndex].services++;
      }
    });

    // Count reviews by month
    reviews.forEach(review => {
      const monthIndex = monthlyData.findIndex(item => item.month === getMonthName(review.createdAt));
      if (monthIndex !== -1) {
        monthlyData[monthIndex].reviews++;
      }
    });

    res.status(200).json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    next(error);
  }
};

// Get project categories distribution
exports.getProjectCategories = async (req, res, next) => {
  try {
    const projects = await Project.find({}, 'projectType');
    
    // Count projects by category
    const categoryCount = {};
    projects.forEach(project => {
      const category = project.projectType || 'Other';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Convert to array and calculate percentages
    const totalProjects = projects.length;
    const categoryData = Object.entries(categoryCount).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      value: totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0,
      count: count
    }));

    // Sort by value (highest first) and take top 4
    categoryData.sort((a, b) => b.value - a.value);
    const topCategories = categoryData.slice(0, 4);

    // Assign colors
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];
    topCategories.forEach((category, index) => {
      category.color = colors[index % colors.length];
    });

    res.status(200).json({
      success: true,
      data: topCategories
    });
  } catch (error) {
    next(error);
  }
};

// Get weekly activity data
exports.getWeeklyActivity = async (req, res, next) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [projects, services, reviews] = await Promise.all([
      Project.find({ createdAt: { $gte: oneWeekAgo } }),
      Service.find({ createdAt: { $gte: oneWeekAgo } }),
      ClientReview.find({ createdAt: { $gte: oneWeekAgo } })
    ]);

    // Initialize weekly data
    const weeklyData = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    days.forEach(day => {
      weeklyData.push({
        day: day,
        activity: 0
      });
    });

    // Count activities by day
    const allActivities = [
      ...projects.map(p => ({ date: p.createdAt })),
      ...services.map(s => ({ date: s.createdAt })),
      ...reviews.map(r => ({ date: r.createdAt }))
    ];

    allActivities.forEach(activity => {
      const dayName = getDayName(activity.date);
      const dayIndex = weeklyData.findIndex(item => item.day === dayName);
      if (dayIndex !== -1) {
        weeklyData[dayIndex].activity++;
      }
    });

    res.status(200).json({
      success: true,
      data: weeklyData
    });
  } catch (error) {
    next(error);
  }
};

// Get general trends and insights
exports.getTrends = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentProjects, recentReviews] = await Promise.all([
      Project.find({ createdAt: { $gte: thirtyDaysAgo } }),
      ClientReview.find({ createdAt: { $gte: thirtyDaysAgo } })
    ]);

    // Calculate average rating if reviews have rating field
    let averageRating = 0;
    if (recentReviews.length > 0) {
      const totalRating = recentReviews.reduce((sum, review) => {
        return sum + (review.rating || 0);
      }, 0);
      averageRating = (totalRating / recentReviews.length).toFixed(1);
    }

    // Get most active project type
    const projectTypes = {};
    recentProjects.forEach(project => {
      const type = project.projectType || 'Other';
      projectTypes[type] = (projectTypes[type] || 0) + 1;
    });

    const mostActiveType = Object.entries(projectTypes)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    res.status(200).json({
      success: true,
      data: {
        recentActivity: {
          newProjects: recentProjects.length,
          newReviews: recentReviews.length,
          averageRating: parseFloat(averageRating)
        },
        insights: {
          mostActiveProjectType: mostActiveType,
          totalActivities: recentProjects.length + recentReviews.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const Team = require('../models/Team');

exports.createMember = async (req, res, next) => {
  try {
    const {
      name, role, image, bio, responsibility, address, experience, email, phone, education,
      specializedDesignAreas, stylesAndTrends, designPrinciples,
      social_facebook, social_instagram, social_linkedin
    } = req.body;
    if (!name || !role) return res.status(400).json({ success: false, message: 'name and role are required' });

    const member = new Team({
      name, role, image: image || '', bio, responsibility, address, experience, email, phone, education,
      specializedDesignAreas, stylesAndTrends, designPrinciples,
      social_facebook, social_instagram, social_linkedin
    });
    await member.save();
    return res.status(201).json({ success: true, message: 'Team member created', data: member });
  } catch (error) { next(error); }
};

exports.getAllMembers = async (req, res, next) => {
  try {
    const members = await Team.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: members.length, data: members });
  } catch (error) { next(error); }
};

exports.getMemberById = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    return res.status(200).json({ success: true, data: member });
  } catch (error) { next(error); }
};

exports.updateMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    const {
      name, role, image, bio, responsibility, address, experience, email, phone, education,
      specializedDesignAreas, stylesAndTrends, designPrinciples,
      social_facebook, social_instagram, social_linkedin
    } = req.body;
    if (name !== undefined) member.name = name;
    if (role !== undefined) member.role = role;
    if (image !== undefined) member.image = image;
    if (bio !== undefined) member.bio = bio;
    if (responsibility !== undefined) member.responsibility = responsibility;
    if (address !== undefined) member.address = address;
    if (experience !== undefined) member.experience = experience;
    if (email !== undefined) member.email = email;
    if (phone !== undefined) member.phone = phone;
    if (education !== undefined) member.education = education;
    if (specializedDesignAreas !== undefined) member.specializedDesignAreas = specializedDesignAreas;
    if (stylesAndTrends !== undefined) member.stylesAndTrends = stylesAndTrends;
    if (designPrinciples !== undefined) member.designPrinciples = designPrinciples;
    if (social_facebook !== undefined) member.social_facebook = social_facebook;
    if (social_instagram !== undefined) member.social_instagram = social_instagram;
    if (social_linkedin !== undefined) member.social_linkedin = social_linkedin;
    // Removed social_twitter and social_website

    await member.save();
    return res.status(200).json({ success: true, message: 'Member updated', data: member });
  } catch (error) { next(error); }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    await Team.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Member deleted' });
  } catch (error) { next(error); }
};
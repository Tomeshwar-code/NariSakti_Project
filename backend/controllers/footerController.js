const Newsletter = require('../models/Newsletter');
const FooterContent = require('../models/FooterContent');
const SiteInfo = require('../models/SiteInfo');

// ============== Newsletter Controllers ==============

// Subscribe to Newsletter
exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email, firstName, lastName, category } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        // Reactivate unsubscribed email
        existingSubscriber.status = 'active';
        existingSubscriber.subscriptionDate = Date.now();
        await existingSubscriber.save();
        return res.status(200).json({
          success: true,
          message: 'Welcome back! You have been resubscribed.',
          data: existingSubscriber,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter.',
      });
    }

    // Get IP address
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Create new subscriber
    const newSubscriber = await Newsletter.create({
      email,
      firstName,
      lastName,
      category: category || 'all',
      source: 'footer',
      ipAddress,
      userAgent,
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      data: newSubscriber,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error subscribing to newsletter',
    });
  }
};

// Unsubscribe from Newsletter
exports.unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const subscriber = await Newsletter.findOneAndUpdate(
      { email },
      { status: 'unsubscribed' },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed from our newsletter.',
      data: subscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error unsubscribing from newsletter',
    });
  }
};

// Get Newsletter Stats
exports.getNewsletterStats = async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments({ status: 'active' });
    const totalUnsubscribed = await Newsletter.countDocuments({ status: 'unsubscribed' });
    const totalInactive = await Newsletter.countDocuments({ status: 'inactive' });
    const thisMonth = await Newsletter.countDocuments({
      subscriptionDate: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
      status: 'active',
    });

    res.status(200).json({
      success: true,
      data: {
        totalSubscribers,
        totalUnsubscribed,
        totalInactive,
        subscribedThisMonth: thisMonth,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching newsletter stats',
    });
  }
};

// ============== Footer Content Controllers ==============

// Get All Footer Content
exports.getFooterContent = async (req, res) => {
  try {
    const footerContent = await FooterContent.find({ isActive: true });
    const siteInfo = await SiteInfo.findOne();

    res.status(200).json({
      success: true,
      data: {
        footerContent,
        siteInfo,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching footer content',
    });
  }
};

// Get Footer Section
exports.getFooterSection = async (req, res) => {
  try {
    const { section } = req.params;

    const footerSection = await FooterContent.findOne({
      section,
      isActive: true,
    });

    if (!footerSection) {
      return res.status(404).json({
        success: false,
        message: 'Footer section not found',
      });
    }

    res.status(200).json({
      success: true,
      data: footerSection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching footer section',
    });
  }
};

// Update Footer Content (Admin Only)
exports.updateFooterContent = async (req, res) => {
  try {
    const { section } = req.params;
    const { title, description, links, contactInfo, socialLinks, businessHours } = req.body;

    const updatedContent = await FooterContent.findOneAndUpdate(
      { section },
      {
        title,
        description,
        links,
        contactInfo,
        socialLinks,
        businessHours,
      },
      { new: true, runValidators: true }
    );

    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        message: 'Footer section not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Footer content updated successfully',
      data: updatedContent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating footer content',
    });
  }
};

// ============== Site Info Controllers ==============

// Get Site Info
exports.getSiteInfo = async (req, res) => {
  try {
    const siteInfo = await SiteInfo.findOne();

    if (!siteInfo) {
      return res.status(404).json({
        success: false,
        message: 'Site info not found',
      });
    }

    res.status(200).json({
      success: true,
      data: siteInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching site info',
    });
  }
};

// Update Site Info (Admin Only)
exports.updateSiteInfo = async (req, res) => {
  try {
    const { companyName, tagline, address, contact, socialMedia, businessHours, policies } = req.body;

    let siteInfo = await SiteInfo.findOne();

    if (!siteInfo) {
      siteInfo = new SiteInfo();
    }

    if (companyName) siteInfo.companyName = companyName;
    if (tagline) siteInfo.tagline = tagline;
    if (address) siteInfo.address = address;
    if (contact) siteInfo.contact = contact;
    if (socialMedia) siteInfo.socialMedia = socialMedia;
    if (businessHours) siteInfo.businessHours = businessHours;
    if (policies) siteInfo.policies = policies;

    await siteInfo.save();

    res.status(200).json({
      success: true,
      message: 'Site info updated successfully',
      data: siteInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating site info',
    });
  }
};

// Get Contact Information
exports.getContactInfo = async (req, res) => {
  try {
    const siteInfo = await SiteInfo.findOne();

    if (!siteInfo || !siteInfo.contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact information not found',
      });
    }

    res.status(200).json({
      success: true,
      data: siteInfo.contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching contact information',
    });
  }
};

// Get Social Media Links
exports.getSocialMedia = async (req, res) => {
  try {
    const siteInfo = await SiteInfo.findOne();

    if (!siteInfo || !siteInfo.socialMedia) {
      return res.status(404).json({
        success: false,
        message: 'Social media information not found',
      });
    }

    res.status(200).json({
      success: true,
      data: siteInfo.socialMedia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching social media information',
    });
  }
};
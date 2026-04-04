const Customer = require("../models/Customer");

exports.registerCustomer = async (req, res) => {
  try {
    const { name, phone, lat, lng } = req.body;

    if (!name || !phone || lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let customer = await Customer.findOne({ phone });

    if (!customer) {
      customer = await Customer.create({
        name,
        phone,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Customer ready",
      customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Customer registration failed",
    });
  }
};

import { Property } from "../Models/PropertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";
import imagekit from "../utils/ImagekitIO.js";

/* ================= GET SINGLE PROPERTY ================= */
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        status: "fail",
        message: "Property not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: property, // ✅ FIXED
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/* ================= CREATE PROPERTY ================= */
export const createProperty = async (req, res) => {
  try {
    const {
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      price,
      images,
    } = req.body;

    const uploadedImages = [];

    if (images && images.length > 0) {
      for (const img of images) {
        const upload = await imagekit.upload({
          file: img.url,
          fileName: `property_${Date.now()}.jpg`,
          folder: "property_images",
        });

        uploadedImages.push({
          url: upload.url,
          public_id: upload.fileId,
        });
      }
    }

    const property = await Property.create({
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      price,
      images: uploadedImages,
      userId: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

/* ================= GET ALL PROPERTIES ================= */
export const getProperties = async (req, res) => {
  try {
    const features = new APIFeatures(Property.find(), req.query)
      .filter()
      .search()
      .paginate();

    const properties = await features.query;
    const totalProperties = await Property.countDocuments();

    res.status(200).json({
      status: "success",
      results: properties.length,
      total: totalProperties,
      data: properties, // ✅ frontend-safe
    });
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

/* ================= GET USER PROPERTIES ================= */
export const getUsersProperties = async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user._id });

    res.status(200).json({
      status: "success",
      results: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

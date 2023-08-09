const Toilet = require('../models/toilet');

// Controller function for finding nearby toilets
exports.findNearbyToilets = async (req, res) => {
  const { location } = req.query;

  // Split the location string into latitude and longitude
  const [latitude, longitude] = location.split(',').map(coord => parseFloat(coord.trim()));

  // Validate latitude and longitude
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid location coordinates.' });
  }

  try {
    // Find nearby toilets using MongoDB's $geoNear aggregation
    const nearbyToilets = await Toilet.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'distance',
          maxDistance: 5000, // In meters, adjust the value as needed
          spherical: true,
        },
      },
      // Optionally, add more stages to add ratings, reviews, and other fields
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'toiletId',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          averageRating: { $avg: '$reviews.rating' },
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          location: 1,
          distance: 1,
          averageRating: 1,
          // You can include more fields as needed
        },
      },
    ]);

    res.json(nearbyToilets);
  } catch (error) {
    console.error('Error finding nearby toilets:', error);
    res.status(500).json({ error: 'An error occurred while fetching nearby toilets.' });
  }
};
const Product =
  require("../models/Product");

const Order =
  require("../models/Order");

const Category =
  require("../models/Category");

/* ================================
   GET PRODUCTS
================================ */
exports.getProducts =
  async (req, res) => {

    try {

      const {
        search,
        category,
        brand,
        minPrice,
        maxPrice,
        sort,
        limit,
      } = req.query;

      let filter = {
  isActive: true,
};

if (!req.query.admin) {

  filter.status = "active";
}

      /* SEARCH */
      if (search) {

        filter.$or = [

          {
            name: {
              $regex: search,
              $options: "i",
            },
          },

          {
            brand: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }

      /* CATEGORY */
      if (category) {

        const categoryNames =
          category.split(",");

        const categoryDocs =
          await Category.find({

            name: {
              $in: categoryNames,
            },
          });

        filter.category = {

          $in:
            categoryDocs.map(
              (c) => c._id
            ),
        };
      }

      /* BRAND */
      if (brand) {

        const brands =
          brand.split(",");

        filter.brand = {
          $in: brands,
        };
      }

      /* PRICE */
      if (
        minPrice ||
        maxPrice
      ) {

        filter.price = {};

        if (minPrice) {

          filter.price.$gte =
            Number(minPrice);
        }

        if (maxPrice) {

          filter.price.$lte =
            Number(maxPrice);
        }
      }


      let query =
        Product.find(filter)

          .populate(
            "category",
            "name"
          );

      /* SORT */
      if (
        sort ===
        "price_asc"
      ) {

        query =
          query.sort({
            price: 1,
          });
      }

      else if (
        sort ===
        "price_desc"
      ) {

        query =
          query.sort({
            price: -1,
          });
      }

      else if (
        sort ===
        "newest"
      ) {

        query =
          query.sort({
            createdAt: -1,
          });
      }

      else {

        query =
          query.sort({
            createdAt: -1,
          });
      }

      /* LIMIT */
      if (limit) {

        query =
          query.limit(
            Number(limit)
          );
      }

      const products =
        await query;

      res.json(products);

    } catch (error) {

      console.error(
        "❌ getProducts:",
        error
      );

      res.status(500).json({
        message:
          "Error fetching products",
      });
    }
  };

/* ================================
   GET PRODUCT BY ID
================================ */
exports.getProductById =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        ).populate(
          "category",
          "name"
        );

      if (!product) {

        return res
          .status(404)
          .json({
            message:
              "Product not found",
          });
      }

      res.json(product);

    } catch (error) {

      console.error(
        "❌ getProductById:",
        error
      );

      res.status(500).json({
        message:
          "Error fetching product",
      });
    }
  };

/* ================================
   CREATE PRODUCT
================================ */
exports.createProduct =
  async (req, res) => {

    try {

      const {
        name,
        brand,
        category,
        description,
        price,
        salePrice,
        stock,
        images,
        status,
      } = req.body;

      if (
        !name ||
        !price ||
        !category
      ) {

        return res
          .status(400)
          .json({
            message:
              "Missing required fields",
          });
      }

      const categoryExists =
        await Category.findById(
          category
        );

      if (!categoryExists) {

        return res
          .status(400)
          .json({
            message:
              "Invalid category",
          });
      }

      const safeImages =
        Array.isArray(images)
          ? images
          : [];

      const product =
        await Product.create({

          name,

          brand,

          category,

          description,

          price:
            Number(price),

          salePrice:
            Number(
              salePrice
            ) || 0,

          stock:
            Number(stock) || 0,


          images:
            safeImages,

          status:
            status ||
            "draft",

          reviews: 0,

          isActive: true,
        });

      const populated =
        await Product.findById(
          product._id
        ).populate(
          "category",
          "name"
        );

      res.status(201).json(
        populated
      );

    } catch (error) {

      console.error(
        "❌ createProduct:",
        error
      );

      res.status(500).json({
        message:
          "Error creating product",
      });
    }
  };

/* ================================
   UPDATE PRODUCT
================================ */
exports.updateProduct =
  async (req, res) => {

    try {

      const updatedData = {
        ...req.body,
      };

      if (
        updatedData.category
      ) {

        const categoryExists =
          await Category.findById(
            updatedData.category
          );

        if (
          !categoryExists
        ) {

          return res
            .status(400)
            .json({
              message:
                "Invalid category",
            });
        }
      }

      const product =
        await Product.findByIdAndUpdate(

          req.params.id,

          updatedData,

          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "category",
          "name"
        );

      if (!product) {

        return res
          .status(404)
          .json({
            message:
              "Product not found",
          });
      }

      res.json(product);

    } catch (error) {

      console.error(
        "❌ updateProduct:",
        error
      );

      res.status(500).json({
        message:
          "Error updating product",
      });
    }
  };

/* ================================
   DELETE PRODUCT
================================ */
exports.deleteProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!product) {

        return res
          .status(404)
          .json({
            message:
              "Product not found",
          });
      }

      res.json({
        message:
          "Product deleted successfully",
      });

    } catch (error) {

      console.error(
        "❌ deleteProduct:",
        error
      );

      res.status(500).json({
        message:
          "Error deleting product",
      });
    }
  };

/* ================================
   BEST SELLERS
================================ */
exports.getBestSellers =
  async (req, res) => {

    try {

      const bestSellers =
        await Order.aggregate([

          {
            $unwind:
              "$items",
          },

          {
            $group: {

              _id:
                "$items.product",

              totalSold: {
                $sum:
                  "$items.qty",
              },
            },
          },

          {
            $sort: {
              totalSold: -1,
            },
          },

          {
            $limit: 4,
          },

          {
            $lookup: {

              from:
                "products",

              localField:
                "_id",

              foreignField:
                "_id",

              as:
                "product",
            },
          },

          {
            $unwind:
              "$product",
          },

          {
            $replaceRoot: {

              newRoot: {

                $mergeObjects: [

                  "$product",

                  {
                    totalSold:
                      "$totalSold",
                  },
                ],
              },
            },
          },
        ]);

      res.json(
        bestSellers
      );

    } catch (error) {

      console.error(
        "❌ getBestSellers:",
        error
      );

      res.status(500).json({
        message:
          "Error fetching best sellers",
      });
    }
  };
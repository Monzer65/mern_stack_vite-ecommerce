/** @format */

const User = require("../models/User");
const Category = require("../models/Category");

module.exports = {
  async getCategories(req, res) {
    try {
      const categories = await Category.find();

      return res.send(categories);
    } catch (error) {
      console.error("Error during category retrieval:", error);
      res.status(500).send("Server error");
    }
  },

  async getFeaturedCategories(req, res) {
    try {
      const categories = await Category.find({ featured: true });

      return res.send(categories);
    } catch (error) {
      console.error("Error during category retrieval:", error);
      res.status(500).send("Server error");
    }
  },

  async createCategory(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      const role = req.user.role;

      if (!role || typeof role !== "string") {
        return res.status(400).send("Invalid role");
      }

      if (role === "admin") {
        const newCategoryData = req.body;

        if (!newCategoryData.name) {
          return res.status(400).send("Category name is required");
        }
        if (!Array.isArray(newCategoryData.subcategories)) {
          return res
            .status(400)
            .send("Subcategories must be an array of strings");
        }

        const newCategory = await Category.create(newCategoryData);
      } else {
        return res
          .status(403)
          .send("You don't have permission to access this route");
      }
    } catch (error) {
      console.error("Error during category creation:", error);
      res.status(500).send("Server error");
    }
  },

  async updateCategory(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      const role = req.user.role;

      if (!role || typeof role !== "string") {
        return res.status(400).send("Invalid role");
      }
      if (role === "admin") {
        const categoryId = req.params.categoryId;
        const { name, subcategoriesToAdd } = req.body;

        const category = await Category.findById(categoryId);

        if (!category) {
          return res.status(404).send("Category not found");
        }

        if (name) {
          category.name = name;
        }

        if (Array.isArray(subcategoriesToAdd)) {
          category.subcategories.push(...subcategoriesToAdd);
        }

        const updatedCategory = await category.save();
      } else {
        return res
          .status(403)
          .send("You don't have permission to access this route");
      }
    } catch (error) {
      console.error("Error during category update:", error);
      res.status(500).send("Server error");
    }
  },

  async deleteCategory(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      const role = req.user.role;

      if (!role || typeof role !== "string") {
        return res.status(400).send("Invalid role");
      }

      if (role === "admin") {
        const categoryId = req.params.categoryId;

        const deletedCategory = await Category.findByIdAndRemove(categoryId);

        if (!deletedCategory) {
          return res.status(404).send("Category not found");
        }

        return res.send("Category deleted successfully");
      } else {
        return res
          .status(403)
          .send("You don't have permission to access this route");
      }
    } catch (error) {
      console.error("Error during category deletion:", error);
      res.status(500).send("Server error");
    }
  },

  async deleteSubcategory(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      const role = req.user.role;

      if (!role || typeof role !== "string") {
        return res.status(400).send("Invalid role");
      }

      if (role === "admin") {
        const categoryId = req.params.categoryId;
        const subcategoryToDelete = req.params.subcategoryId;

        const category = await Category.findById(categoryId);

        if (!category) {
          return res.status(404).send("Category not found");
        }

        const subcategoryIndex =
          category.subcategories.indexOf(subcategoryToDelete);
        if (subcategoryIndex === -1) {
          return res.status(404).send("Subcategory not found");
        }

        category.subcategories.splice(subcategoryIndex, 1);
        await category.save();

        return res.send("Subcategory deleted successfully");
      } else {
        return res
          .status(403)
          .send("You don't have permission to access this route");
      }
    } catch (error) {
      console.error("Error during subcategory deletion:", error);
      res.status(500).send("Server error");
    }
  },
};

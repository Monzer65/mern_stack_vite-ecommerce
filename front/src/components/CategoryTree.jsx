/** @format */

const CategoryTree = () => {
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/categories");
      const nestedCategories = buildCategoryTree(data);
      setCategories(nestedCategories);
    } catch (err) {
      console.log(err);
    }
  };
};

export default CategoryTree;

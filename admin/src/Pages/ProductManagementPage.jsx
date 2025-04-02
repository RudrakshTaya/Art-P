import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaImage, FaSave } from "react-icons/fa";
import './ProductManagementPage.css'
const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    brand: "",
    stock: "",
    images: [],
    discount: "",
    discountExpiresAt: "",
    isCustomizable: false,
    customizationOptions: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [visiblePanel, setVisiblePanel] = useState("products"); // "products" or "form"
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const categories = [
    'Original Handmade Art and Decor',
    'Personalized Clothing and Accessories',
    'DIY Kits and Craft Materials',
    'Customized Home and Gift Items',
    'Sustainable and Upcycled Crafts',
    'Limited Edition Collaborative Products',
  ];

  const subcategories = {
    'Original Handmade Art and Decor': ['Paintings and Sculptures', 'Wall Hangings', 'Handmade Pottery'],
    'Personalized Clothing and Accessories': ['Custom Embroidered Apparel', 'Handmade Jewelry'],
    'DIY Kits and Craft Materials': ['Candle-Making Kits', 'Embroidery Kits', 'Woodworking Kits'],
    'Customized Home and Gift Items': ['Personalized Gifts', 'Keepsake Boxes'],
    'Sustainable and Upcycled Crafts': ['Eco-Friendly Decor', 'Sustainable Home Goods'],
    'Limited Edition Collaborative Products': ['Exclusive Art Pieces', 'Collaborative Home Decor'],
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5002/api/ad/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products", err);
      setError("Failed to load products. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "images" && files) {
      const imagesArray = Array.from(files);
      setFormData((prevData) => ({
        ...prevData,
        [name]: [...prevData.images, ...imagesArray],
      }));
      
      const newPreviews = imagesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } else if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleCustomizationChange = (index, field, value) => {
    const updatedOptions = [...formData.customizationOptions];

    if (field === "optionType" && value === "image") {
      updatedOptions[index] = { ...updatedOptions[index], optionType: value, choices: [] };
    } else {
      updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    }

    setFormData((prevData) => ({ ...prevData, customizationOptions: updatedOptions }));
  };

  const addCustomizationOption = () => {
    setFormData((prevData) => ({
      ...prevData,
      customizationOptions: [
        ...prevData.customizationOptions,
        { optionName: "", optionType: "text", choices: [], required: false },
      ],
    }));
  };

  const handleChoiceChange = (optionIndex, choiceIndex, value) => {
    const updatedOptions = [...formData.customizationOptions];
    
    if (!updatedOptions[optionIndex].choices[choiceIndex]) {
      updatedOptions[optionIndex].choices[choiceIndex] = {};
    }
    
    updatedOptions[optionIndex].choices[choiceIndex].value = value;
    
    setFormData(prev => ({
      ...prev,
      customizationOptions: updatedOptions
    }));
  };

  const addChoice = (optionIndex) => {
    const updatedOptions = [...formData.customizationOptions];
    if (!updatedOptions[optionIndex].choices) {
      updatedOptions[optionIndex].choices = [];
    }
    updatedOptions[optionIndex].choices.push({ value: "" });
    
    setFormData(prev => ({
      ...prev,
      customizationOptions: updatedOptions
    }));
  };

  const removeChoice = (optionIndex, choiceIndex) => {
    const updatedOptions = [...formData.customizationOptions];
    updatedOptions[optionIndex].choices = updatedOptions[optionIndex].choices.filter((_, i) => i !== choiceIndex);
    
    setFormData(prev => ({
      ...prev,
      customizationOptions: updatedOptions
    }));
  };

  const removeCustomizationOption = (index) => {
    const updatedOptions = formData.customizationOptions.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, customizationOptions: updatedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData.images.forEach((image) => {
            if (image instanceof File) {
              data.append("images", image);
            }
          });
        } else if (key === "customizationOptions") {
          data.append("customizationOptions", JSON.stringify(formData.customizationOptions));
        } else {
          data.append(key, formData[key]);
        }
      });

      const requestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
          console.log(data);
      if (isEditing) {
        await axios.put(`http://localhost:5002/api/ad/admin/products/${currentProductId}`, data, requestConfig);
        setSuccess("Product updated successfully!");
      } else {
        await axios.post("http://localhost:5002/api/ad/admin/products", data, requestConfig);
        
        setSuccess("Product added successfully!");
      }

      resetForm();
      fetchProducts();
      setVisiblePanel("products");
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Failed to save the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5002/api/ad/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
      setSuccess("Product deleted successfully!");
    } catch (err) {
      setError("Failed to delete the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      brand: product.brand || "",
      stock: product.stock || "",
      discount: product.discount || "",
      discountExpiresAt: product.discountExpiresAt ? product.discountExpiresAt.slice(0, 10) : "",
      images: [],
      isCustomizable: product.isCustomizable || false,
      customizationOptions: product.customizationOptions || [],
    });
    setImagePreviews(product.images ? product.images.map((image) => image.url) : []);
    setIsEditing(true);
    setCurrentProductId(product._id);
    setVisiblePanel("form");
  };

  const handleAddNew = () => {
    resetForm();
    setVisiblePanel("form");
  };

  const handleCancelEdit = () => {
    resetForm();
    setVisiblePanel("products");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      subcategory: "",
      brand: "",
      stock: "",
      images: [],
      discount: "",
      discountExpiresAt: "",
      isCustomizable: false,
      customizationOptions: [],
    });
    setImagePreviews([]);
    setIsEditing(false);
    setCurrentProductId(null);
    setError(null);
    setSuccess(null);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "price") {
        comparison = parseFloat(a.price) - parseFloat(b.price);
      } else if (sortBy === "stock") {
        comparison = parseInt(a.stock) - parseInt(b.stock);
      } else {
        comparison = a[sortBy]?.localeCompare(b[sortBy]);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <div className="pm-container">
      <div className="pm-header">
        <h1 className="pm-title">Product Management</h1>
        <div className="pm-actions">
          {visiblePanel === "products" ? (
            <button 
              className="pm-button pm-button-primary"
              onClick={handleAddNew}
            >
              <FaPlus /> Add New Product
            </button>
          ) : (
            <button 
              className="pm-button pm-button-secondary"
              onClick={handleCancelEdit}
            >
              <FaTimes /> Cancel
            </button>
          )}
        </div>
      </div>

      {error && <div className="pm-alert pm-alert-error">{error}</div>}
      {success && <div className="pm-alert pm-alert-success">{success}</div>}

      {visiblePanel === "form" ? (
        <div className="pm-form-panel">
          <form onSubmit={handleSubmit} className="pm-form">
            <h2 className="pm-form-title">{isEditing ? "Edit Product" : "Add New Product"}</h2>
            
            <div className="pm-form-section">
              <h3 className="pm-section-title">Basic Information</h3>
              <div className="pm-form-grid">
                <div className="pm-form-group">
                  <label className="pm-label">Product Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="pm-input"
                    required 
                  />
                </div>

                <div className="pm-form-group">
                  <label className="pm-label">Brand</label>
                  <input 
                    type="text" 
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleChange} 
                    className="pm-input"
                  />
                </div>

                <div className="pm-form-group">
                  <label className="pm-label">Category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    className="pm-select"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="pm-form-group">
                <label className="pm-label">Subcategory</label>
                <select name="subcategory" 
                value={formData.subcategory} 
                onChange={handleChange}
                className="pm-select"
                >
               <option value="">--Select Subcategory--</option>
                {subcategories[formData.category]?.map((sub, index) => (
                  <option key={index} value={sub}>{sub}</option>
                ))}
              </select>
              </div>
              
                
                <div className="pm-form-group">
                  <label className="pm-label">Price ($)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    className="pm-input"
                    step="0.01"
                    min="0"
                    required 
                  />
                </div>

                <div className="pm-form-group">
                  <label className="pm-label">Stock Quantity</label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleChange} 
                    className="pm-input"
                    min="0"
                    required 
                  />
                </div>

                <div className="pm-form-group">
                  <label className="pm-label">Discount (%)</label>
                  <input 
                    type="number" 
                    name="discount" 
                    value={formData.discount} 
                    onChange={handleChange} 
                    className="pm-input"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="pm-form-group">
                  <label className="pm-label">Discount Expiry Date</label>
                  <input 
                    type="date" 
                    name="discountExpiresAt" 
                    value={formData.discountExpiresAt} 
                    onChange={handleChange} 
                    className="pm-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="pm-form-section">
              <h3 className="pm-section-title">Description</h3>
              <div className="pm-form-group">
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="pm-textarea"
                  rows="4"
                  required
                  placeholder="Detailed product description"
                />
              </div>
            </div>

            <div className="pm-form-section">
              <h3 className="pm-section-title">Product Images</h3>
              <div className="pm-form-group">
                <label className="pm-label pm-file-label">
                  <FaImage className="pm-icon" />
                  <span>Add Product Images</span>
                  <input 
                    type="file" 
                    name="images" 
                    accept="image/*"
                    multiple 
                    onChange={handleChange} 
                    className="pm-file-input"
                  />
                </label>
                <p className="pm-help-text">Upload high-quality images (recommended: 1000x1000px)</p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="pm-image-previews">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="pm-image-preview-item">
                      <img src={src} alt={`Preview ${index}`} className="pm-image-preview" />
                      <button 
                        type="button"
                        onClick={() => removeImage(index)} 
                        className="pm-button-icon pm-button-remove"
                        title="Remove image"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pm-form-section">
              <div className="pm-section-header">
                <h3 className="pm-section-title">Customization Options</h3>
                <div className="pm-form-group pm-form-switch">
                  <label className="pm-switch-label">
                    <input 
                      type="checkbox" 
                      name="isCustomizable" 
                      checked={formData.isCustomizable}
                      onChange={handleChange}
                      className="pm-switch"
                    />
                    <span className="pm-switch-slider"></span>
                    <span className="pm-switch-text">Enable Customization</span>
                  </label>
                </div>
              </div>

              {formData.isCustomizable && (
                <div className="pm-customization-panel">
                  {formData.customizationOptions.map((option, index) => (
                    <div key={index} className="pm-customization-option">
                      <div className="pm-option-header">
                        <h4 className="pm-option-title">Option {index + 1}</h4>
                        <button 
                          type="button" 
                          onClick={() => removeCustomizationOption(index)}
                          className="pm-button-icon pm-button-remove"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    
                      <div className="pm-form-grid">
                        <div className="pm-form-group">
                          <label className="pm-label">Option Name</label>
                          <input 
                            type="text" 
                            value={option.optionName} 
                            onChange={(e) => handleCustomizationChange(index, "optionName", e.target.value)}
                            className="pm-input"
                            placeholder="e.g., Color, Size, Engraving"
                          />
                        </div>
                      
                        <div className="pm-form-group">
                          <label className="pm-label">Option Type</label>
                          <select 
                            value={option.optionType} 
                            onChange={(e) => handleCustomizationChange(index, "optionType", e.target.value)}
                            className="pm-select"
                          >
                            <option value="text">Text</option>
                            <option value="dropdown">Dropdown Selection</option>
                            <option value="image">Image Selection</option>
                            <option value="color">Color Selection</option>
                          </select>
                        </div>
                      
                        <div className="pm-form-group pm-form-switch">
                          <label className="pm-switch-label">
                            <input 
                              type="checkbox" 
                              checked={option.required}
                              onChange={(e) => handleCustomizationChange(index, "required", e.target.checked)}
                              className="pm-switch"
                            />
                            <span className="pm-switch-slider"></span>
                            <span className="pm-switch-text">Required</span>
                          </label>
                        </div>
                      </div>

                      {(option.optionType === "dropdown" || option.optionType === "color") && (
                        <div className="pm-choices">
                          <div className="pm-choices-header">
                            <h5 className="pm-choices-title">Choices</h5>
                            <button 
                              type="button" 
                              onClick={() => addChoice(index)}
                              className="pm-button-small"
                            >
                              <FaPlus /> Add Choice
                            </button>
                          </div>
                          
                          <div className="pm-choices-list">
                            {option.choices && option.choices.map((choice, choiceIndex) => (
                              <div key={choiceIndex} className="pm-choice-item">
                                <input 
                                  type="text" 
                                  value={choice.value || ""} 
                                  onChange={(e) => handleChoiceChange(index, choiceIndex, e.target.value)}
                                  className="pm-input pm-input-sm"
                                  placeholder={option.optionType === "color" ? "e.g., #FF5733 or Red" : "Choice value"}
                                />
                                <button 
                                  type="button" 
                                  onClick={() => removeChoice(index, choiceIndex)}
                                  className="pm-button-icon pm-button-remove-sm"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button 
                    type="button" 
                    onClick={addCustomizationOption}
                    className="pm-button pm-button-secondary"
                  >
                    <FaPlus /> Add Option
                  </button>
                </div>
              )}
            </div>

            <div className="pm-form-actions">
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="pm-button pm-button-secondary"
              >
                <FaTimes /> Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="pm-button pm-button-primary"
              >
                <FaSave /> {isEditing ? "Update Product" : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="pm-products-panel">
          <div className="pm-filter-bar">
            <div className="pm-search-container">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="pm-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="pm-sort-container">
              <label className="pm-label">Sort by:</label>
              <select 
                className="pm-select pm-select-sm"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="category">Category</option>
                <option value="stock">Stock</option>
              </select>
              <button 
                className="pm-button-icon"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              >
                {sortDirection === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="pm-loading">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="pm-empty-state">
              <p>No products found. Click "Add New Product" to get started.</p>
            </div>
          ) : (
            <div className="pm-product-table-container">
              <table className="pm-product-table">
                <thead>
                  <tr>
                    <th className="pm-col-image">Image</th>
                    <th className="pm-col-name">Product</th>
                    <th className="pm-col-category">Category</th>
                    <th className="pm-col-price">Price</th>
                    <th className="pm-col-stock">Stock</th>
                    <th className="pm-col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="pm-col-image">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0].url} 
                            alt={product.name} 
                            className="pm-product-thumbnail" 
                          />
                        ) : (
                          <div className="pm-no-image">No image</div>
                        )}
                      </td>
                      <td className="pm-col-name">
                        <div className="pm-product-name">{product.name}</div>
                        {product.discount > 0 && (
                          <div className="pm-discount-badge">
                            {product.discount}% OFF
                          </div>
                        )}
                      </td>
                      <td className="pm-col-category">
                        {product.category}
                        {product.subcategory && (
                          <span className="pm-subcategory"> / {product.subcategory}</span>
                        )}
                      </td>
                      <td className="pm-col-price">
                        <div className="pm-price-display">
                          ${parseFloat(product.price).toFixed(2)}
                        </div>
                      </td>
                      <td className="pm-col-stock">
                        <div className={`pm-stock-indicator ${parseInt(product.stock) <= 5 ? 'pm-stock-low' : ''}`}>
                          {product.stock}
                        </div>
                      </td>
                      <td className="pm-col-actions">
                        <div className="pm-action-buttons">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="pm-button-icon pm-button-edit"
                            title="Edit product"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDelete(product._id)}
                            className="pm-button-icon pm-button-delete"
                            title="Delete product"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;
import React, { useState, useEffect } from 'react';
import { ComboDto, productDto } from '../../../models/comboDto';
import { addCombo } from '../../../services/comboService';
import { getAllProducts } from '../../../services/productService'; // API lấy sản phẩm từ backend

interface AddComboModalProps {
    onSubmit: () => void; // Hàm được gọi khi thêm combo thành công
    onClose: () => void;  // Hàm được gọi khi đóng modal
    categoryId : string;
}

const AddComboModal: React.FC<AddComboModalProps> = ({ categoryId, onSubmit, onClose }) => {
    const [combo, setCombo] = useState<ComboDto>({
        id: '',
        name: '',
        code: '',
        price: 0,
        image: '',
        description: '',
        Status: 'available',
        createdBy: '',
        createdAt: new Date(),
        modifiedAt: new Date(),
        modifiedBy: '',
        products: [],
        categoryId : categoryId
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Lưu trữ thông báo lỗi
    const [productOptions, setProductOptions] = useState<productDto[]>([]); // Lưu trữ sản phẩm
    // Lấy tất cả sản phẩm khi component được mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts(); // Fetch product data
                console.log('Dữ liệu từ API:', response); // Log the response for debugging
    
                if (response && Array.isArray(response.items)) {
                    setProductOptions(response.items); // Set productOptions to the items array
                } else {
                    console.error('Dữ liệu trả về không phải là mảng:', response);
                }
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
            }
        };
        fetchProducts();
    }, []);
    

    const handleInputChange = (field: keyof ComboDto, value: string | number) => {
        setCombo((prevCombo) => ({ ...prevCombo, [field]: value }));
    };

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    //         if (!validImageTypes.includes(file.type)) {
    //             setErrors((prevErrors) => ({
    //                 ...prevErrors,
    //                 image: 'Vui lòng chọn một tệp hình ảnh hợp lệ (.jpg, .png, .gif)!',
    //             }));
    //             return;
    //         }
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setCombo((prevCombo) => ({
    //                 ...prevCombo,
    //                 image: reader.result as string,
    //             }));
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setCombo((prevData) => ({
          ...prevData,
          // [id]: id === 'price' 
          //   ? Number(value) 
          //   : value,
          [id]: id === 'price' ? Number(value) : value,
        }));
    
        // Reset lỗi khi người dùng thay đổi giá trị
        setErrors((prevErrors) => ({
          ...prevErrors,
          [id]: '',
        }));
      };
    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!combo.name) {
            newErrors.name = 'Tên combo không được để trống!';
        }
        if (combo.price <= 0) {
            newErrors.price = 'Giá phải lớn hơn 0!';
        }
        if (!combo.image) {
            newErrors.image = 'Hình ảnh không được để trống!';
        }
        if (!combo.description) {
            newErrors.description = 'Mô tả không được để trống!';
        }
        if (combo.products.length === 0) {
            newErrors.products = 'Phải có ít nhất một sản phẩm trong combo!';
        } else {
            combo.products.forEach((product, index) => {
                if (!product.name) {
                    newErrors[`productName${index}`] = `Tên sản phẩm không được để trống (Sản phẩm ${index + 1})!`;
                }
                if (product.quantity <= 0) {
                    newErrors[`quantity${index}`] = `Số lượng phải lớn hơn 0 (Sản phẩm ${index + 1})!`;
                }
            });
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validate()) return;
        const productsToSave = combo.products.map(product => ({
            id: product.id,
            quantity: product.quantity
        }));
    
        const updatedCombo = {
            ...combo,
            products: productsToSave
        };
        try {
            await addCombo(updatedCombo as any); // Gọi API thêm combo
            alert("Thêm combo thành công!");
            onSubmit(); // Gọi hàm onSubmit nếu thành công
            onClose(); // Đóng modal
        } catch (error) {
            console.error('Lỗi khi thêm combo:', error);
            setErrors({ form: 'Có lỗi xảy ra khi thêm Combo. Vui lòng thử lại!' });
        }
    };

    const addProduct = () => {
        const newProduct: productDto = {
            id: '',
            name: '',
            price:0,
            quantity: 1, // Giả sử trường này là tùy chọn
        };
        setCombo((prevCombo) => ({
            ...prevCombo,
            products: [...prevCombo.products, newProduct],
        }));
    };

    const removeLastProduct = () => {
        if (combo.products.length > 0) {
            setCombo((prevCombo) => ({
                ...prevCombo,
                products: prevCombo.products.slice(0, -1),
            }));
        }
    };

    const handleProductChange = (index: number, field: keyof productDto, value: string | number) => {
        const updatedProducts = combo.products.map((product, i) => {
            if (i === index) {
                if (field === 'name' && typeof value === 'string') {
                    // Tìm sản phẩm trong productOptions theo tên
                    const selectedProduct = productOptions.find(option => option.name === value);
                    if (selectedProduct) {
                        // Gán giá trị ID và price của sản phẩm
                        return {
                            ...product,
                            name: selectedProduct.name,

                            id: selectedProduct.id,
                            price: selectedProduct.price,
                            quantity:selectedProduct.quantity
                        };
                    }
                }
                return { ...product, [field]: value };
            }
            return product;
        });
    
        setCombo((prevCombo) => ({ ...prevCombo, products: updatedProducts }));
    };

    return (
        <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered custom-combo-size size-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm Combo</h5>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleFormSubmit}>
                            <div className="row">
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label className="form-label">Tên Combo</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            value={combo.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <div className="error-message text-danger">{errors.name}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={combo.code}
                                            onChange={(e) => handleInputChange('code', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ảnh</label>
                                        <input
                                            // type="file"
                                            type="text"
                                            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                            accept="image/*"
                                            // onChange={handleFileChange}
                                            onChange={handleChange}
                                        />
                                        {errors.image && <div className="error-message text-danger">{errors.image}</div>}
                                        {combo.image && <img src={combo.image} alt="Preview" width="150" />}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Giá</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                            value={combo.price}
                                            onChange={(e) => handleInputChange('price', Number(e.target.value))}
                                            required
                                        />
                                        {errors.price && <div className="error-message text-danger">{errors.price}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mô tả</label>
                                        <textarea
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            value={combo.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                           
                                        />
                                        {errors.description && <div className="error-message text-danger">{errors.description}</div>}
                                    </div>
                                    <div className="d-flex justify-content-end mb-3" style={{ gap: '15px' }}>
                                        <button type="button" className="btn btn-outline-primary" onClick={addProduct}>
                                            Thêm Sản Phẩm
                                        </button>
                                        <button type="button" className="btn btn-outline-danger" onClick={removeLastProduct}>
                                            Xóa Bớt Sản Phẩm
                                        </button>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div id="productsContainer" className="row">
                                        <h5>Sản Phẩm Trong Combo</h5>
                                        {combo.products.map((product, index) => (
                                            <div key={`${product.id}-${index}`} className="product-item mb-3 col-12">
                                                <div className="row">
                                                    <div className="col-4">
                                                        <label className="form-label">Tên Sản Phẩm</label>
                                                        <select
                                                            className="form-select"
                                                            value={product.name}
                                                            onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                                            required
                                                        >
                                                            <option value="" disabled>Chọn sản phẩm...</option>
                                                            {Array.isArray(productOptions) && productOptions.map((option) => (
                                                                <option key={option.id} value={option.name}  style={{color:'red'}}>
                                                                    
                                                                    {option.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors[`productName${index}`] && (
                                                            <div className="error-message text-danger">{errors[`productName${index}`]}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-4">
                                                        <label className="form-label">Giá</label>
                                                        <input
                                                            type="number"
                                                            className={`form-control ${errors[`price${index}`] ? 'is-invalid' : ''}`}
                                                            value={product.price}
                                                            onChange={(e) => handleProductChange(index, 'price', Number(e.target.value))}
                                                            min="1"
                                                            disabled

                                                        />
                                                        
                                                        {errors[`price${index}`] && (
                                                            <div className="error-message text-danger">{errors[`price${index}`]}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-4">
                                                        <label className="form-label">Số lượng</label>
                                                        <input
                                                            type="number"
                                                            className={`form-control ${errors[`quantity${index}`] ? 'is-invalid' : ''}`}
                                                            value={product.quantity}
                                                            onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                                                            min="1"
                                                            required
                                                        />
                                                        
                                                        {errors[`quantity${index}`] && (
                                                            <div className="error-message text-danger">{errors[`quantity${index}`]}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {errors.products && <div className="error-message text-danger">{errors.products}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Đóng
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Thêm Combo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddComboModal;
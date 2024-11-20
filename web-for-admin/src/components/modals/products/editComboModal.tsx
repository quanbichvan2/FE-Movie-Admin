import React, { useEffect, useState } from 'react';
import { ComboDto, productDto } from '../../../models/comboDto';
import { getCombosById, editCombo } from '../../../services/comboService';
import { toast } from 'react-toastify';
import { getAllProducts } from '../../../services/productService';
interface EditModalComboProps {
    comboId: string; // Nhận comboId thay vì combo
    onClose: () => void;
    onUpdate: (updatedCombo: ComboDto) => void;
}

const EditComboModal: React.FC<EditModalComboProps> = ({ comboId, onClose, onUpdate }) => {
    const [editedCombo, setEditedCombo] = useState<ComboDto | null>(null);
    const [products, setProducts] = useState<productDto[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [productOptions, setProductOptions] = useState<productDto[]>([]);
    useEffect(() => {
        const fetchComboDetails = async () => {
            const comboData = await getCombosById(comboId);
            if (comboData) {
                // Tạo ra mảng sản phẩm với trường price từ unitPrice
                const updatedProducts = comboData.products.map(product => ({
                    ...product,
                    unitPrice: product.price, // Gán unitPrice thành price
                }));
                setEditedCombo(comboData);
                setProducts(updatedProducts);
            } else {
                console.error("Không có dữ liệu combo nào được trả về.");
            }
        };
    
        if (comboId) {
            fetchComboDetails();
        }
    }, [comboId]);
    
    useEffect(() => {
        // Giả sử bạn có một hàm để lấy danh sách sản phẩm
        const fetchProductOptions = async () => {
            try {
                const response = await getAllProducts();
                console.log("Dữ liệu trả về từ API:", response);
                if (response && Array.isArray(response.items)) {
                    setProductOptions(response.items);
                } else {
                    setProductOptions([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
                setProductOptions([]); // Đảm bảo không để sản phẩm bị undefined
            }
        };
        fetchProductOptions();
    }, []);
    const handleInputChange = (field: keyof ComboDto, value: string | number) => {
        if (editedCombo) {
            setEditedCombo((prev) => ({ ...prev!, [field]: value }));
        }
    };

    const handleProductChange = (index: number, field: keyof productDto, value: string | number) => {
        console.log("handleProductChange called:", { index, field, value });
        const updatedProducts = products.map((product, i) => {
            if (i === index) {
                if (field === 'name' && typeof value === 'string') {
                    
                    // Tìm sản phẩm trong productOptions theo tên
                    const selectedProduct = productOptions.find(option => option.name === value);
                    console.log("Product Options:", productOptions);
                      console.log("Selected Product:", selectedProduct);
                    if (selectedProduct) {
                        
                        // Gán giá trị ID và price của sản phẩm
                        return {
                            ...product,
                            name: selectedProduct.name,
                            id: selectedProduct.id,
                            price: selectedProduct.price,
                            quantity:selectedProduct.quantity,
                            isExisting: true
                        };
                    }
                  
                }
                return { ...product, [field]: value };
            }
            return product;
        });
        setProducts(updatedProducts);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedCombo) return;

        const newErrors: any = {};

        // Validation logic
        if (!editedCombo.name) {
            newErrors.name = 'Tên combo không được để trống!';
        }
        if (editedCombo.price <= 0) {
            newErrors.price = 'Giá combo phải lớn hơn 0!';
        }
        if (!editedCombo.description) {
            newErrors.description = 'Mô tả không được để trống!';
        }

        products.forEach((product, index) => {
            if (!product.name) {
                newErrors[`Product_name_${index}`] = `Tên sản phẩm ${index + 1} không được để trống!`;
            }
            if (product.quantity <= 0) {
                newErrors[`Quantity_${index}`] = `Số lượng sản phẩm ${index + 1} phải lớn hơn 0!`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const updatedCombo = {
                ...editedCombo,
                products,
            };
            await editCombo(updatedCombo, comboId);
            onUpdate(updatedCombo);
            toast.success("Cập nhật combo thành công!");
            onClose();
        } catch (error) {
            console.error('Error updating combo:', error);
        }
    };
    const addProduct = () => {
        const newProduct: productDto = { id: '', name: '', price: 0, quantity: 1 };
        setProducts((prevProducts) => [...prevProducts, newProduct]);
    };

    const removeLastProduct = () => {
        if (products.length > 0) {
            setProducts((prevProducts) => prevProducts.slice(0, -1));
        }
    };
  
    if (!editedCombo) return null; // Hiển thị loading hoặc null nếu combo chưa được tải

    return (
        <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered custom-combo-size">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="editComboModalLabel">Chỉnh Sửa Combo</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form id="editComboForm" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-6">
                                    {/* Các trường thông tin combo */}
                                    <div className="mb-3">
                                        <label className="form-label">Tên Combo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editedCombo.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <div className="text-danger">{errors.name}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editedCombo.code}
                                            onChange={(e) => handleInputChange('code', e.target.value)}
                                            required
                                        />
                                        {errors.code && <div className="text-danger">{errors.code}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mô Tả</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={editedCombo.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            required
                                        ></textarea>
                                        {errors.description && <div className="text-danger">{errors.description}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Giá</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={editedCombo.price}
                                            onChange={(e) => handleInputChange('price', Number(e.target.value))}
                                            required
                                        />
                                        {errors.price && <div className="text-danger">{errors.price}</div>}
                                    </div>
                                    <div className="d-flex justify-content-end mb-3">
                                        <button type="button" className="btn btn-outline-primary" style={{marginRight:'1rem'}} onClick={addProduct}>
                                            Thêm Sản Phẩm
                                        </button>
                                        <button type="button" className="btn btn-outline-danger" onClick={removeLastProduct}>
                                            Xóa Bớt Sản Phẩm
                                        </button>
                                    </div>
                                </div>
                                <div className="col-6">
                                    {/* Hiển thị danh sách sản phẩm trong combo */}
                                    <div className="row">
                                        <h5>Sản Phẩm Trong Combo</h5>
                                        {products.map((product, index) => (
                                            <div key={`${product.id}-${index}`} className="product-item mb-3 col-12">
                                                <div className="row">
                                                    <div className="col-4">
                                                        <label className="form-label">Tên Sản Phẩm</label>
                                                        {/* <input
                                                            type="text"
                                                            className="form-control"
                                                            value={product.name}
                                                            onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                                            required
                                                        /> */}
                                                        <select
                                                        className="form-select"
                                                        value={product.name}
                                                        onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                                        disabled={!!product.id}
                                                    >
                                             
                                                        {Array.isArray(productOptions) && productOptions.map((option) => (
                                                            <option key={option.id} value={option.name}>
                                                                {option.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    </div>
                                                    <div className="col-4">
                                                        <label className="form-label">Giá</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={product.price}
                                                            onChange={(e) => handleProductChange(index, 'price', Number(e.target.value))}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="col-4">
                                                        <label className="form-label">Số lượng</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={product.quantity}
                                                            onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                                                            min="1"
                                                            required
                                                        />
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end" style={{ gap: '15px', margin: '15px' }}>
                                <button type="submit" className="btn btn-primary">Cập Nhật</button>
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditComboModal;
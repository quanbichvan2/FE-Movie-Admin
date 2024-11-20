import { useEffect, useState } from 'react';
import AddFoodModal from '../../components/modals/products/addFoodModal';
import AddDrinkModal from '../../components/modals/products/addDrinkModal'; // Import modal mới
import EditFoodModal from '../../components/modals/products/editFoodModal';
import { productDto } from '../../models/productDto';
import AddComboModal from '../../components/modals/products/addComboModal';
import { ComboDto } from '../../models/comboDto';
import EditModalCombo from '../../components/modals/products/editComboModal';
import { getAllProducts } from "../../services/productService";
import { getAllCombo } from "../../services/comboService";
import { editFood } from '../../services/productService';
const FoodManagementPage = () => {
  const FOOD_CATEGORY_ID = '1a5310dc-61b0-42fe-bbed-e5ed3475002d'; // Thay đổi ID này theo cấu trúc của bạn
  const DRINK_CATEGORY_ID = '1a5310dc-61b0-42fe-bbed-e5ed3475002f'; // Thay đổi ID này theo cấu trúc của bạn
  const COMBO_CATEGORY_ID = '1a5310dc-61b0-42fe-bbed-e5ed3475002d'; // Thay đổi ID này theo cấu trúc của bạn
  const [foods, setFoods] = useState<productDto[]>([
  ]);

  const [drinks, setDrinks] = useState<productDto[]>([
  ]);

  const [combos, setCombos] = useState<ComboDto[]>([
  ]);

  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [isAddDrinkModalOpen, setIsAddDrinkModalOpen] = useState(false); // Thêm trạng thái cho modal thêm thức uống
  const [isEditFoodModalOpen, setIsEditFoodModalOpen] = useState(false);
  const [isAddComboModalOpen, setIsAddComboModalOpen] = useState(false);
  const [currentFood, setCurrentFood] = useState<productDto | null>(null);
  const [isEditComboModalOpen, setIsEditComboModalOpen] = useState(false);
  const [currentCombo, setCurrentCombo] = useState<ComboDto | null>(null);
  const [searchFood, setSearchFood] = useState('');
  const [searchDrink, setSearchDrink] = useState('');
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {

      const allProductsResponse = await getAllProducts();
      if (allProductsResponse && Array.isArray(allProductsResponse.items)) {
        const allProducts = allProductsResponse.items;
        setFoods(allProducts.filter((product: productDto) => product.categoryId === FOOD_CATEGORY_ID));
        setDrinks(allProducts.filter((product: productDto) => product.categoryId === DRINK_CATEGORY_ID));
      }
    };

    fetchProducts();
  }, [reloadFlag]);
  useEffect(() => {
    const fetchCombos = async () => {

      const allCombos = await getAllCombo();
      if (allCombos && Array.isArray(allCombos.items)) {
        setCombos(allCombos.items || []);
      }
    };

    fetchCombos();
  }, [reloadFlag]);
  const handleOpenComboModal = () => {
    setIsAddComboModalOpen(true);
  };

  const handleCloseComboModal = () => {
    setReloadFlag((prevFlag) => !prevFlag);
    setIsAddComboModalOpen(false);
  };


  const handleOpenAddFoodModal = () => {
    setIsAddFoodModalOpen(true);

  };

  const handleCloseAddFoodModal = () => {
    setReloadFlag((prevFlag) => !prevFlag);
    setIsAddFoodModalOpen(false);
  };

  const handleOpenAddDrinkModal = () => {
    setIsAddDrinkModalOpen(true); // Mở modal thêm đồ uống
  };

  const handleCloseAddDrinkModal = () => {
    setReloadFlag((prevFlag) => !prevFlag);
    setIsAddDrinkModalOpen(false); // Đóng modal thêm đồ uống
  };

  const handleOpenEditModal = (food: productDto) => {
    setCurrentFood(food);
    setIsEditFoodModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditFoodModalOpen(false);
    setCurrentFood(null);
  };

  const handleEditFood = async (updatedFood: productDto) => {
    try {
      await editFood(updatedFood.id, updatedFood);
      // Update the local list based on category
      if (updatedFood.categoryId === FOOD_CATEGORY_ID) {
        setFoods((prevFoods) =>
          prevFoods.map((product) => (product.id === updatedFood.id ? updatedFood : product))
        );
      } else if (updatedFood.categoryId === DRINK_CATEGORY_ID) {
        setDrinks((prevDrinks) =>
          prevDrinks.map((product) => (product.id === updatedFood.id ? updatedFood : product))
        );
      }
      setReloadFlag((prevFlag) => !prevFlag);
      handleCloseEditModal(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleOpenEditComboModal = (combo: ComboDto) => {
    setCurrentCombo(combo);
    setIsEditComboModalOpen(true);
  };

  const handleCloseEditComboModal = () => {
    setIsEditComboModalOpen(false);
    setCurrentCombo(null);
  };

  const handleEditCombo = (updatedCombo: ComboDto) => {
    setCombos((prevCombos) =>
      prevCombos.map((combo) => (combo.id === updatedCombo.id ? updatedCombo : combo))
    );
    handleCloseEditComboModal();
  };

  return (
    <div className="page-content">
      <section className="row">
        <div className="col-12 col-lg-12">
          {/* Food Management */}
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h4>Quản lý Thức Ăn Nhẹ - Food</h4>
              <button className="btn btn-outline-success" onClick={handleOpenAddFoodModal}>
                Thêm Món Ăn
              </button>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm đồ ăn..."
                  value={searchFood}
                  onChange={(e) => setSearchFood(e.target.value)}
                />
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Mã Snacks</th>
                      <th>Ảnh</th>
                      <th>Tên Món</th>
                      <th>Giá</th>
                      <th>Hoạt Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods
                      .filter((food) => food.name.includes(searchFood))
                      .map((food) => (
                        <tr key={food.id}>
                          <td>{food.code}</td>
                          <td>
                            <img src={food.image} alt={food.name} width="100" />
                          </td>
                          <td>{food.name}</td>
                          <td>{food.price.toLocaleString()} VND</td>
                          <td>
                            <button className="btn btn-outline-info" onClick={() => handleOpenEditModal(food)}>
                              Chỉnh Sửa
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Drink Management */}
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h4>Quản lý Thức Uống - Drink</h4>
              <button className="btn btn-outline-success" onClick={handleOpenAddDrinkModal}>
                Thêm Thức Uống
              </button>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm thức uống..."
                  value={searchDrink}
                  onChange={(e) => setSearchDrink(e.target.value)}
                />
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Mã Thức Uống</th>
                      <th>Ảnh</th>
                      <th>Tên Thức Uống</th>
                      <th>Giá</th>
                      <th>Tình Trạng</th>
                      <th>Hoạt Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drinks
                      .filter((drink) => drink.name.includes(searchDrink))
                      .map((drink) => (
                        <tr key={drink.id}>
                          <td>{drink.code}</td>
                          <td>
                            <img src={drink.image} alt={drink.name} width="100" />
                          </td>
                          <td>{drink.name}</td>
                          <td>{drink.price.toLocaleString()} VND</td>
                          <td>
                            <button className="btn btn-outline-info" onClick={() => handleOpenEditModal(drink)}>
                              Chỉnh Sửa
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Combos Management */}
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h4>Quản lý Combo</h4>
              <button className="btn btn-outline-success" onClick={handleOpenComboModal}>
                Thêm Combo
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID Combo</th>
                      <th>Ảnh</th>
                      <th>Tên Combo</th>
                      <th>Giá</th>
                      <th>Hoạt Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combos.map((combo) => (
                      <tr key={combo.id}>
                        <td>{combo.code}</td>
                        <td><img src={combo.image} alt="" width="100" /></td>
                        <td>{combo.name}</td>
                        <td>{combo.price.toLocaleString()} VND</td>
                        <td>
                          <button className="btn btn-outline-info" onClick={() => handleOpenEditComboModal(combo)}>
                            Chỉnh Sửa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isAddFoodModalOpen && (
        <AddFoodModal
          categoryId={FOOD_CATEGORY_ID}
          onSubmit={() => {
            setIsAddFoodModalOpen(false);
            getAllProducts();
          }}
          onClose={handleCloseAddFoodModal}

        />
      )}
      {isAddDrinkModalOpen && (
        <AddDrinkModal
          categoryId={DRINK_CATEGORY_ID}
          onSubmit={() => {
            setIsAddDrinkModalOpen(false);
            getAllProducts();
          }}
          onClose={handleCloseAddDrinkModal}
        />
      )}
      {isEditFoodModalOpen && currentFood !== null && (
        <EditFoodModal
          onSubmit={handleEditFood}  // Unified handler for both food and drinks
          onClose={handleCloseEditModal}
          foodData={currentFood}
        />
      )}
      {isAddComboModalOpen && (
        <AddComboModal
          categoryId={COMBO_CATEGORY_ID}
          onSubmit={() => {
            setIsAddComboModalOpen(false);
            getAllCombo(); // Hàm này gọi lại danh sách món ăn sau khi thêm thành công
          }}
          onClose={handleCloseComboModal}
        />
      )}
      {isEditComboModalOpen && currentCombo !== null && (
        <EditModalCombo
          onUpdate={handleEditCombo}
          onClose={handleCloseEditComboModal}
          comboId={currentCombo.id}
        />
      )}
    </div>
  );
};

export default FoodManagementPage;
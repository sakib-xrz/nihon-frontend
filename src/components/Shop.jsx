"use client";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetchAllBrandQuery } from "@/redux/feathers/brand/brandApi";
import { useFetchAllProductsQuery } from "@/redux/feathers/Product/ProductApi";
import { addProduct } from "@/redux/feathers/Product/ProductSlice";
import { useFetchAllCategoryQuery } from "@/redux/feathers/shop/shopApi";
import { toggleWishlistItem } from "@/redux/feathers/wishlist/wishlistSlice";
import { FilterFilled, SearchOutlined } from "@ant-design/icons";
import {
  Input,
  Pagination,
  Radio,
  Select,
  Slider,
  Space,
  Drawer,
  Button,
  Grid,
} from "antd";
import { toast } from "sonner";
import "../style/shop.css";
import Error from "./Error";
import GlobalModalCard from "./GlobalModalCard/GlobalModalCard";
import Loading from "./Loading";
import { sanitizeParams } from "@/utils";
import ProductCard from "./ProductCard";

const { Option } = Select;
const { useBreakpoint } = Grid;

/* Custom debounce hook: it waits for the given delay before updating the debounced value. */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function Shop() {
  const screens = useBreakpoint();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);

  // State for the product modal
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [title, setTitle] = useState("");
  const [singleProductData, setSingleProductData] = useState({});
  const [selectImage, setSelectImage] = useState(0);

  // Filter states
  const [categoryValue, setCategoryValue] = useState("");
  const [brandValue, setBrandValue] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");

  // Drawer state for mobile filters
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Fetch categories and brands
  const {
    isLoading: categoryLoading,
    isError: categoryError,
    data: categoryData,
  } = useFetchAllCategoryQuery();
  const {
    isLoading: brandLoading,
    isError: brandError,
    data: brandData,
  } = useFetchAllBrandQuery();

  // Memoize filters so that they don’t get recreated on every render.
  const filters = useMemo(
    () => ({
      category: categoryValue,
      brand: brandValue,
      searchTerm,
      page,
      limit: 12,
      minPrice,
      maxPrice,
      sort,
    }),
    [categoryValue, brandValue, searchTerm, page, minPrice, maxPrice, sort]
  );

  // Debounce the filters object to reduce rapid API calls
  const debouncedFilters = useDebounce(filters, 500);

  // Fetch products with debounced filter parameters
  const {
    isLoading: productLoading,
    isError: productError,
    data: productData,
  } = useFetchAllProductsQuery(sanitizeParams(debouncedFilters));

  // Compute maximum price based on the fetched product data (fallback to 1000 if not available)
  const computedMaxPrice = useMemo(() => {
    return (
      productData?.data?.reduce(
        (max, item) => (item.price > max ? item.price : max),
        0
      ) || 1000
    );
  }, [productData]);

  // When new product data arrives, update the maxPrice state if needed.
  useEffect(() => {
    const newMax =
      productData?.data?.reduce(
        (max, item) => (item.price > max ? item.price : max),
        0
      ) || 1000;
    if (newMax !== maxPrice) {
      setMaxPrice(newMax);
    }
  }, [productData, maxPrice]);

  // Reset pagination to page 1 whenever any filter changes (except page)
  useEffect(() => {
    setPage(1);
  }, [categoryValue, brandValue, searchTerm, minPrice, maxPrice, sort]);

  const totalProduct = productData?.meta?.total || 0;

  // Handlers for filters

  const handleCategoryChange = (e) => {
    setCategoryValue(e.target.value);
  };

  const handleBrandChange = (e) => {
    setBrandValue(e.target.value);
  };

  // For the search input, we update the state immediately.
  // The debounced filters hook will ensure the API call is delayed.
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Use the slider as a range slider: update both min and max price when the user stops sliding.
  const handlePriceAfterChange = (values) => {
    if (Array.isArray(values)) {
      setMinPrice(values[0]);
      setMaxPrice(values[1]);
    } else {
      setMinPrice(values);
    }
  };

  const onSortChange = (value) => {
    setSort(value);
  };

  // Wishlist and cart actions
  const addToWishlist = (item) => {
    dispatch(toggleWishlistItem(item));
  };

  const handleAddToCart = (product) => {
    if (!user) {
      toast.warning(
        "Please log in to your account to add products to your cart."
      );
    } else {
      dispatch(addProduct(product));
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  // Drawer toggle functions
  const openDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  // Clear search sort and filters logic
  const clearFilters = () => {
    setCategoryValue("");
    setBrandValue("");
    setMinPrice(0);
    setMaxPrice(0);
    setSearchTerm("");
    setSort("");
  };

  // Render the list of products
  let content = null;
  if (productLoading) {
    content = <Loading />;
  } else if (productError) {
    content = <Error error="Something went wrong" />;
  } else if (!productData || productData.data?.length === 0) {
    content = <Error error="No Data Found" />;
  } else {
    content = productData.data.map((item) => {
      const isOutOfStock = item?.in_stock <= 0;
      return (
        <ProductCard
          key={item?._id}
          item={item}
          isOutOfStock={isOutOfStock}
          addToWishlist={addToWishlist}
          handleAddToCart={handleAddToCart}
          setOpen={setOpen}
          setSelectedImages={setSelectedImages}
          setSelectImage={setSelectImage}
          setSingleProductData={setSingleProductData}
          setTitle={setTitle}
        />
      );
    });
  }

  // Render category filter content
  let categoryContent = null;
  if (categoryLoading) {
    categoryContent = <Loading />;
  } else if (categoryError) {
    categoryContent = <Error text="Something went wrong" />;
  } else if (!categoryData || categoryData.data?.length === 0) {
    categoryContent = <Error text="No Data Found" />;
  } else {
    categoryContent = categoryData.data.map((item, index) => (
      <div key={index} className="rounded-md transition-all">
        <Radio
          className="text-gray-600 text-base py-2 w-full font-medium"
          value={item?._id}
        >
          {item?.name}
        </Radio>
      </div>
    ));
  }

  // Render brand filter content
  let brandContent = null;
  if (brandLoading) {
    brandContent = <Loading />;
  } else if (brandError) {
    brandContent = <Error text="Something went wrong" />;
  } else if (!brandData || brandData.data?.length === 0) {
    brandContent = <Error text="No Data Found" />;
  } else {
    brandContent = brandData.data.map((item, index) => (
      <div key={index} className="rounded-md transition-all">
        <Radio
          className="text-gray-600 text-base py-2 w-full font-medium"
          value={item?._id}
        >
          {item?.name}
        </Radio>
      </div>
    ));
  }

  // Sidebar filter for larger screens
  const filterSidebar = (
    <div className="filter w-[350px] bg-white rounded-lg shadow-sm border p-6 h-fit sticky top-36 z-10">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Filters</h2>
      <Select
        className="w-full mb-6"
        placeholder="Sort by Product"
        onChange={onSortChange}
        size="large"
      >
        <Option value="-createdAt">Default</Option>
        <Option value="priceAsc">Price: Low to High</Option>
        <Option value="priceDesc">Price: High to Low</Option>
      </Select>

      <div className="space-y-6">
        {/* <div>
          <h3 className="text-gray-800 font-semibold mb-4">Price Range</h3>
          <Slider
            range
            defaultValue={[minPrice, maxPrice || computedMaxPrice]}
            max={maxPrice || computedMaxPrice}
            onAfterChange={handlePriceAfterChange}
            className="mt-2"
          />
        </div> */}

        <div>
          <h3 className="text-gray-800 font-semibold mb-4">Categories</h3>
          <Radio.Group
            onChange={handleCategoryChange}
            value={categoryValue}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              {categoryContent}
            </Space>
          </Radio.Group>
        </div>

        <div>
          <h3 className="text-gray-800 font-semibold mb-4">Brand</h3>
          <Radio.Group
            onChange={handleBrandChange}
            value={brandValue}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              {brandContent}
            </Space>
          </Radio.Group>
        </div>
      </div>
    </div>
  );

  // Drawer filter for mobile devices
  const filterDrawerContent = (
    <div className="flex flex-col h-full">
      <Select
        className="w-full mb-6"
        placeholder="Sort by Product"
        onChange={onSortChange}
        size="large"
      >
        <Option value="-createdAt">Default</Option>
        <Option value="priceAsc">Price: Low to High</Option>
        <Option value="priceDesc">Price: High to Low</Option>
      </Select>

      <div className="flex-grow space-y-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Filters</h2>

        {/* <div>
          <h3 className="text-gray-800 font-semibold mb-4">Price Range</h3>
          <Slider
            range
            defaultValue={[minPrice, maxPrice || computedMaxPrice]}
            max={maxPrice || computedMaxPrice}
            onAfterChange={handlePriceAfterChange}
            className="mt-2"
          />
        </div> */}

        <div>
          <h3 className="text-gray-800 font-semibold mb-4">Categories</h3>
          <Radio.Group
            onChange={handleCategoryChange}
            value={categoryValue}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              {categoryContent}
            </Space>
          </Radio.Group>
        </div>

        <div>
          <h3 className="text-gray-800 font-semibold mb-4">Brand</h3>
          <Radio.Group
            onChange={handleBrandChange}
            value={brandValue}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              {brandContent}
            </Space>
          </Radio.Group>
        </div>
      </div>

      <div className="space-y-3 bg-gray-50">
        <Button
          type="primary"
          onClick={closeDrawer}
          className="w-full h-10 font-medium"
        >
          Apply Filters
        </Button>
        <Button
          type="default"
          onClick={() => {
            closeDrawer();
            clearFilters();
          }}
          className="w-full h-10 font-medium"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div
        className="container mx-auto px-4 my-8"
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-delay="500"
      >
        <div className="md:bg-white md:shadow-sm rounded-lg md:p-3 max-w-3xl mx-auto">
          <div className="flex gap-3">
            <Input
              size="large"
              className="flex-1"
              placeholder="Search for products..."
              onChange={handleSearchChange}
              prefix={<SearchOutlined className="text-gray-400" />}
            />
            {screens.lg && (
              <Button
                type="default"
                icon={<FilterFilled />}
                onClick={clearFilters}
                size="large"
              >
                Clear
              </Button>
            )}
            {!screens.lg && (
              <Button
                type="primary"
                icon={<FilterFilled />}
                onClick={openDrawer}
                size="large"
              >
                {screens.md ? "Filters" : ""}
              </Button>
            )}
          </div>
        </div>
      </div>
      {screens.md ? (
        <div className="flex gap-5">
          {filterSidebar}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {content}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {content}
          </div>
        </div>
      )}
      <div className="flex justify-center my-10">
        <Pagination
          className="text-center"
          current={page}
          total={totalProduct}
          pageSize={12}
          onChange={handlePageChange}
        />
      </div>
      <Drawer
        title="Filters"
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
      >
        {filterDrawerContent}
      </Drawer>
      <GlobalModalCard
        open={open}
        onClose={() => setOpen(false)}
        singleProductData={singleProductData}
        selectedImages={selectedImages}
        title={title}
      />
    </div>
  );
}

export default Shop;

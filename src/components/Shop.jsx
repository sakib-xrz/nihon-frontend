"use client";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetchAllBrandQuery } from "@/redux/feathers/brand/brandApi";
import { useFetchAllProductsQuery } from "@/redux/feathers/Product/ProductApi";
import { addProduct } from "@/redux/feathers/Product/ProductSlice";
import { useFetchAllCategoryQuery } from "@/redux/feathers/shop/shopApi";
import { toggleWishlistItem } from "@/redux/feathers/wishlist/wishlistSlice";
import { FilterFilled } from "@ant-design/icons";
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
  const [limit, setLimit] = useState(12);
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
      limit,
      minPrice,
      maxPrice,
      sort,
    }),
    [
      categoryValue,
      brandValue,
      searchTerm,
      page,
      limit,
      minPrice,
      maxPrice,
      sort,
    ]
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
      <div key={index}>
        <Radio
          className="text-gray-400 text-[18px] mt-2 font-bold"
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
      <div key={index}>
        <Radio
          className="text-gray-400 text-[18px] font-bold mt-2"
          value={item?._id}
        >
          {item?.name}
        </Radio>
      </div>
    ));
  }

  // Sidebar filter for larger screens
  const filterSidebar = (
    <div className="dasktopfilter filter w-[350px] p-4">
      <Select
        className="mt-5 w-full h-10"
        placeholder="Sort by Product"
        onChange={onSortChange}
      >
        <Option value="lowToHigh">Price: Low to High</Option>
        <Option value="highToLow">Price: High to Low</Option>
        <Option value="rating">Sort by Rating</Option>
      </Select>
      <h3 className="text-bold text-gray-700 font-bold mt-5">Price Range</h3>
      <Slider
        range
        defaultValue={[minPrice, maxPrice || computedMaxPrice]}
        max={maxPrice || computedMaxPrice}
        onAfterChange={handlePriceAfterChange}
      />
      <h3 className="text-bold text-gray-700 font-bold mt-5">Categories</h3>
      <Radio.Group onChange={handleCategoryChange} value={categoryValue}>
        <Space direction="vertical">{categoryContent}</Space>
      </Radio.Group>
      <h3 className="text-bold text-gray-700 font-bold mt-5">Brand</h3>
      <Radio.Group onChange={handleBrandChange} value={brandValue}>
        <Space direction="vertical">{brandContent}</Space>
      </Radio.Group>
    </div>
  );

  // Drawer filter for mobile devices
  const filterDrawerContent = (
    <>
      <div className="p-4">
        <h3 className="text-bold text-gray-700 font-bold mt-2">Price Range</h3>
        <Slider
          range
          defaultValue={[minPrice, maxPrice || computedMaxPrice]}
          max={maxPrice || computedMaxPrice}
          onAfterChange={handlePriceAfterChange}
        />
        <h3 className="text-bold text-gray-700 font-bold mt-4">Categories</h3>
        <Radio.Group onChange={handleCategoryChange} value={categoryValue}>
          <Space direction="vertical">{categoryContent}</Space>
        </Radio.Group>
        <h3 className="text-bold text-gray-700 font-bold mt-4">Brand</h3>
        <Radio.Group onChange={handleBrandChange} value={brandValue}>
          <Space direction="vertical">{brandContent}</Space>
        </Radio.Group>
      </div>
      <Button type="primary" onClick={closeDrawer} className="mt-4 w-full">
        Apply Filters
      </Button>
      <Button
        type="primary"
        danger
        onClick={() => {
          closeDrawer();
          clearFilters();
        }}
        className="mt-4 w-full"
      >
        Clear filters
      </Button>
    </>
  );

  return (
    <div className="w-full">
      <div
        className="container text-center my-8 mx-auto flex"
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-delay="500"
      >
        <Input
          className="w-full"
          placeholder="Search Your Product"
          onChange={handleSearchChange}
        />
        {screens.lg && (
          <Button
            type="primary"
            icon={<FilterFilled />}
            onClick={clearFilters}
            className="ml-3 h-10"
          >
            Clear Filters
          </Button>
        )}

        {/* On small screens, show a Filters button to open the Drawer */}
        {!screens.lg && (
          <Button
            type="primary"
            icon={<FilterFilled />}
            onClick={openDrawer}
            className="ml-3 h-10"
          >
            Filters
          </Button>
        )}
      </div>
      {screens.md ? (
        <div className="flex gap-5">
          {filterSidebar}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {content}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {content}
          </div>
        </div>
      )}
      <div className="flex justify-center my-10">
        <Pagination
          className="text-center"
          current={page}
          total={totalProduct}
          pageSize={limit}
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

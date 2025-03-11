import style from '../style/Subscribe.css';

function Subscribe() {
  return (
    <div className="subscribe">
      <h2 className="text-3xl font-bold mb-4 text-white" data-aos="fade-up"data-aos-anchor-placement="top-bottom" data-aos-delay="500">Subscribe to Our Newsletter</h2>
      <p className="mb-6 text-white" data-aos="fade-up"data-aos-anchor-placement="top-bottom" data-aos-delay="500">
        Stay updated with the latest news, offers, and promotions. Subscribe to our newsletter by entering your email below.
      </p>
      <form className="flex justify-center items-center w-full" data-aos="fade-up"data-aos-anchor-placement="top-bottom" data-aos-delay="500">
       <div className='flex'>
       <input
          type="email"
          placeholder="Enter your email"
          style={{width:'70%',margin:"0 auto"}}
          className=" sm:w-full p-2 border border-gray-300 rounded-l-md focus:outline-none"
        />
        <button
        style={{background:'white'}}
          type="submit"
          className=" text-gray-800 p-2 rounded-r-md hover:bg-blue-700 transition-colors"
        >
          Subscribe
        </button>
       </div>
      </form>
    </div>
  );
}

export default Subscribe;
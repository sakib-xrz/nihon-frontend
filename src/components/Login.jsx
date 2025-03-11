"use client"
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import '../style/login.css';
import { useLoginMutation } from '@/redux/feathers/Auth/AuthApi';
import { toast } from 'sonner';
import { DecodedData } from '@/utils/DecodedData';
import { setUsers } from '@/redux/feathers/Auth/AuthSlice';



const Login = () => {
  const [addLoginData,{isLoading,isError,data}] = useLoginMutation()
  const dispatch = useDispatch()
  const router = useRouter()
  const onFinish = async (values) => {
    try {
      const res = await addLoginData(values);
  
      if (res?.data?.data?.accessToken) {
        const user = await DecodedData(res?.data?.data.accessToken);
        console.log(user)
        dispatch(setUsers({user:user,token:res?.data?.data.accessToken}))
        toast.success(res?.data?.message)
        setTimeout(() => {
          if (user) {
            router.push('/')
          }
        }, 2000);
      }
  
      if (res?.error?.data?.success === false) {
        toast.error(res?.error?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  

 
 

  const onFinishFailed = (errorInfo) => {};

  return (
    <div className="background min-h-screen w-full flex justify-center items-center flex-col`">
      <div className="bg-white p-8 shadow-md rounded-md w-[90%] sm:w-[85%] md:w-[40%] mx-auto">
        <h2 className="text-2xl font-bold text-[#663130] mb-6 text-center">Login</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="space-y-4"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              size='large'
              type="email"
              placeholder="Email"
              className="mt-1 border bg-transparent outline-none block w-full rounded-md shadow-sm p-2"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              className="mt-1 border bg-transparent outline-none  w-full rounded-md shadow-sm "
            />
          </Form.Item>
          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: '#663130', padding: '0px 40px', color: 'white', fontWeight: 'bold', fontSize: '18px' }}
              className='border px-5'
            >
              {isLoading ? "Loading" : "Login"}
            </Button>
          </Form.Item>

          <p className='text-center text-[16px] font-medium'>
            If you have no account, please <Link className='font-bold' href='/signup'>Create Account</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
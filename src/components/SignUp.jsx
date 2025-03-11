"use client"
import { useRegisterMutation } from '@/redux/feathers/Auth/AuthApi';
import { Button, Form, Input, Radio } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import '../style/signup.css'

const SignUp = () => {
  const [addNewRegister,{isLoading,isError,data}] = useRegisterMutation()
  const router = useRouter()
  const onFinish = async (values) => {
      try{
        const res = await addNewRegister(values)
        if(res?.data?.success){
          toast.success(res?.data?.message)
          router.push('/login')
        }
        if(res?.error?.data?.success === false){
          toast.error(res?.error?.data?.message)
        }
      }
      catch(error){
        console.log(error)
      }
  };

  

  const onFinishFailed = (errorInfo) => {
    
  };

  return (
    <div className="background min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded-md w-[90%] sm:w-[85%] md:w-[40%]">
        <h2 className="text-2xl font-bold text-[#663130] mb-6 text-center">Registration</h2>
        <Form
          name="registration"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="space-y-4"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              size="large"
              type="text"
              placeholder="Name"
              className="mt-1 border bg-transparent outline-none block w-full rounded-md shadow-sm p-2"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              size="large"
              type="email"
              placeholder="Email"
              className="mt-1 border bg-transparent  outline-none block w-full rounded-md shadow-sm p-2"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              className="mt-1 border bg-transparent outline-none w-full rounded-md shadow-sm p-2"
            />
          </Form.Item>

          <Form.Item
            name="gender"
            rules={[{ required: true, message: 'Please select your gender!' }]}
          >
            <Radio.Group className="text-white">
              <Radio value="male" >Male</Radio>
              <Radio value="female" >Female</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: '#663130', padding: '0px 40px', color: 'white', fontWeight: 'bold', fontSize: '18px' }}
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </Form.Item>

          {isError && <div className="text-red-500 text-center mt-2">Registration failed. Please try again.</div>}

          <p className="text-center space-x-3 text-[16px] font-medium">
            If you already have an account, please <Link className="font-bold" href="/login">Login</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
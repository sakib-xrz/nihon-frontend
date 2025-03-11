"use client";
import AdminRouter from '@/components/AdminRouter/AdminRouter';
import DashbrodNavbar from '@/components/DashbrodNavbar/DashbrodNavbar';
import menuItems from '@/components/DashbrodNavbar/DashbrodNavbarMenu';
import { Layout, Menu } from 'antd';
import { Toaster } from 'sonner';

const { Header, Content, Sider } = Layout;

const Page = ({ children }) => {

  return (
    <Layout>
      <Sider
        style={{ background: 'white' }}
        breakpoint="lg"
        width="300px"
        collapsedWidth="0"
      >
        <div className="demo-logo-vertical" />
        <Menu theme="light" mode="inline" defaultSelectedKeys={['4']} items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ background: 'white' }}>
          <DashbrodNavbar />
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <div
            style={{
              padding: 24,
              height: 'auto',
              background: 'white',
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
      <Toaster richColors position="top-center" />
    </Layout>
  );
};

export default Page;

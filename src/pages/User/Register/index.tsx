import { Footer } from '@/components';
import { register } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, history } from '@umijs/max';
import { message, Select, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import Settings from '../../../../config/defaultSettings';
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { styles } = useStyles();

  const handleRegsiter = async (values: API.RegisterParams) => {
    try {
      // 登录
      const result = await register({
        ...values,
      });
      const { userPassword, checkedUserPassword } = values;
      if (userPassword !== checkedUserPassword) {
        message.error('两次输入的密码不一致');
        return;
      }

      if (result < 0) {
        throw new Error(`注册失败,返回的id:${result}格式不正确`);
      }

      const urlParams = new URL(window.location.href).searchParams;
      const redirect = urlParams.get('redirect');
      history.push({ pathname: '/user/login' }, redirect);
      message.success('注册成功');
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>

      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          submitter={{ searchConfig: { submitText: '注册' } }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="test1" src="/折木4.jpg" />}
          title="大帅逼"
          subTitle={<a href="https://github.com/lomanqqq/usercenter-ui"> 好好学习</a>}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleRegsiter(values as API.RegisterParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '注册',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码长度不能小于8',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkedUserPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请确认密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码长度不能小于8',
                  },
                ]}
              />

              <ProForm.Item name="userRole" rules={[{ required: true }]}>
                <Select
                  showSearch
                  options={[
                    { label: '管理员', value: 'admin' },
                    { label: '普通用户', value: 'normal' },
                  ]}
                  // 强制值类型为字符串
                  fieldNames={{ label: 'label', value: 'value' }}
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase()) ?? false
                  }
                />
              </ProForm.Item>
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

// options={[
//   {
//     value: 'admin',
//     label: 'admin',
//   },
//   {
//     value: 'normal',
//     label: 'normal',
//   },
// ]}

export default Register;

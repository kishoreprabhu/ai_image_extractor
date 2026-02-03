import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';

import { type FieldType } from '../../types/login';

type LoginFormProps = {
  onSubmit: (values: FieldType) => void;
}

const LoginForm = ({onSubmit}: LoginFormProps) => {
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    onSubmit(values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      id='login-form-wrapper'
      className='pr-30'
    >
      <Form.Item<FieldType>
        label="Username"
        name="userName"
        rules={[{ required: true, message: 'Please input your username!' }]}
        className='form-label'
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
        className='form-label'
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null} className="form-action-right">
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
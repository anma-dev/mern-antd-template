import React from 'react';
import { Form, Card, message } from 'antd';
import ProForm, {
  ProFormCheckbox,
  ProFormSelect,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { save, getResources, getRoles } from '../service';

const EntryForm = (props) => {

  const [form] = Form.useForm();
  const [role, setRole] = React.useState(null);
  const [resource, setResource] = React.useState(null);

  // get roles 
  const fetchRoles = async () => {
    const result = await getRoles();
    const options = result.data.map(r => ({ label: r.name, value: r._id }));
    return options;
  };

  // get resources
  const fetchResources = async () => {
    const result = await getResources();
    const options = result.data.map(r => ({ label: r.name, value: r._id }));
    return options;
  };

  const onFinish = async (values) => {
    console.log('values', values);

    if (!values.hasOwnProperty('isDisabled')) {
      values.isDisabled = false;
    }

    if (!values.hasOwnProperty('isAllowed')) {
      values.isAllowed = false;
    }

    const result = await save({ ...values, roleName: role.roleName, resourceName: resource.resourceName });
    console.log('resource', result);
    if (result instanceof Error) {
      message.error(result.message);
    }
    else {
      message.success(result.message);
      form.resetFields();
      // setRole(null);
    }
  };

  return (
    <PageContainer content="My amazing resource entry form">
      <Card bordered={false}>
        <ProForm
          hideRequiredMark
          style={{
            margin: 'auto',
            marginTop: 8,
            maxWidth: 600,
          }}
          name="basic"
          layout="vertical"
          onFinish={(v) => onFinish(v)}
          form={form}
        >
          <ProFormSelect
            width="md"
            name="roleId"
            label="Roles"
            request={fetchRoles}
            placeholder="Please select a role"
            rules={[{ required: true, message: 'Please select a role' }]}
            onChange={(value, e) => setRole({ roleId: value, roleName: e.label })}
          />
          <ProFormSelect
            width="md"
            name="resourceId"
            label="Resources"
            request={fetchResources}
            placeholder="Please select resource"
            rules={[{ required: true, message: 'Please select a resource' }]}
            onChange={(value, e) => setResource({ resourceId: value, resourceName: e.label })}
          />
          <ProFormCheckbox name="isAllowed">
            Is allowed
          </ProFormCheckbox>
          <ProFormCheckbox name="isDisabled">
            Is disabled
          </ProFormCheckbox>
        </ProForm>

      </Card>
    </PageContainer>
  );
};

export default EntryForm;

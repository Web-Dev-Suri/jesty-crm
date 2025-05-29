import CrudModule from '@/modules/CrudModule/CrudModule';
import CustomerForm from '@/forms/CustomerForm';
import { fields } from './config';
import { useEffect, useState } from 'react';

import useLanguage from '@/locale/useLanguage';
import request from '@/request/request';

export default function Customer() {
  const translate = useLanguage();
  const entity = 'client';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('client'),
    DATATABLE_TITLE: translate('client_list'),
    ADD_NEW_ENTITY: translate('add_new_client'),
    ENTITY_NAME: translate('client'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };

  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    request.list({ entity: '/admin', options: { role: 'user' } }).then(res => {
      setUserOptions(
        (res.result || []).map(user => ({
          label: user.name,
          value: user._id,
        }))
      );
    });
  }, []);

  return (
    <CrudModule
      createForm={<CustomerForm userOptions={userOptions} />}
      updateForm={<CustomerForm userOptions={userOptions} isUpdateForm={true} />}
      config={config}
    />
  );
}

import { useLayoutEffect } from 'react';

import UpdateForm from '@/components/UpdateForm';
import DeleteModal from '@/components/DeleteModal';
import CreateForm from '@/components/CreateForm';

import LeadsInsights from '@/components/LeadsInsights/LeadsInsights';
import DataTable from '@/components/DataTable/DataTable';

import { useDispatch } from 'react-redux';

import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';

import { CrudLayout } from '@/layout';

function SidePanelTopContent({ config, createForm, updateForm, withUpload }) {
  const { state } = useCrudContext();
  const { actionType } = state.currentAction || {};

  if (actionType === 'create') {
    return <CreateForm config={config} formElements={createForm} withUpload={withUpload} />;
  }
  if (actionType === 'update') {
    return <UpdateForm config={config} formElements={updateForm} withUpload={withUpload} />;
  }
  // Default: show client details
  return <LeadsInsights config={config} />;
}

function FixHeaderPanel({ config }) {
  // Remove the search bar and add button entirely
  return null;
}

function CrudModule({ config, createForm, updateForm, withUpload = false, filterOptions }) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(crud.resetState());
  }, []);

  return (
    <CrudLayout 
      config={config}
      fixHeaderPanel={<FixHeaderPanel config={config} />}
      sidePanelTopContent={
        <SidePanelTopContent
          config={config}
          createForm={createForm}
          updateForm={updateForm}
          withUpload={withUpload}
        />
      }
    >
      <DataTable config={config} filterOptions={filterOptions} />
      <DeleteModal config={config} />
    </CrudLayout>
  );
}

export default CrudModule;

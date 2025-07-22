import { useLayoutEffect } from 'react';

import UpdateForm from '@/components/UpdateForm';
import DeleteModal from '@/components/DeleteModal';

import LeadsInsights from '@/components/LeadsInsights/LeadsInsights';
import DataTable from '@/components/DataTable/DataTable';

import { useDispatch } from 'react-redux';

import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';

import { CrudLayout } from '@/layout';

function SidePanelTopContent({ config, formElements, withUpload }) {
  const { crudContextAction, state } = useCrudContext();
  const { modal, editBox } = crudContextAction;

  const { isReadBoxOpen, isEditBoxOpen } = state;
  const dispatch = useDispatch();

  const removeItem = () => {
    dispatch(crud.currentAction({ actionType: 'delete', data: currentItem }));
    modal.open();
  };
  const editItem = () => {
    dispatch(crud.currentAction({ actionType: 'update', data: currentItem }));
    editBox.open();
  };

  return (
    <>
      {/* Removed the Row with edit/remove buttons and search bar */}
      {/* <ReadItem config={config} /> */}
      <LeadsInsights config={config} />
      <UpdateForm config={config} formElements={formElements} withUpload={withUpload} />
    </>
  );
}

function FixHeaderPanel({ config }) {
  // Remove the search bar and add button entirely
  return null;
}

function CrudModule({ config, updateForm, withUpload = false, filterOptions }) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(crud.resetState());
  }, []);

  return (
    <CrudLayout 
      config={config}
      fixHeaderPanel={<FixHeaderPanel config={config} />}
      sidePanelTopContent={
        <SidePanelTopContent config={config} formElements={updateForm} withUpload={withUpload} />
      }
    >
      <DataTable config={config} filterOptions={filterOptions} />
      <DeleteModal config={config} />
    </CrudLayout>
  );
}

export default CrudModule;

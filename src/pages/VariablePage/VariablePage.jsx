import { notificationController } from '@app/controllers/notificationController'
import { useAppDispatch } from '@app/hooks/reduxHooks'
import { doCreateVariable, doUpdateVariable } from '@app/store/slices/variableSlice'
import { Button } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VariablesTable } from './components/VariablesTable'
import CrudModal from './Form'
import * as S from './VariablePage.styles'

function VariablePage() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch();
    const [record, setRecord] = useState(null)
    const { t } = useTranslation();

    const onSave = (isEditMode, values, id) => {
        const valuesToSend = { ...values, customer: values.customer.value }
        if(!isEditMode){
        setLoading(true)
        dispatch(doCreateVariable(valuesToSend))
        .unwrap()
        .then((res) => {
          notificationController.success({
            message: t('device.deviceCreatedSuccesfullly'),
            // @ts-ignored
            description: `${t('device.createdNewDevice')}`,
          });
          setLoading(false);
          setOpen(false)
          setRecord(null)
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
          setLoading(false);
        });}else{
            const dataToUpdate = {
                id: id,
                data: valuesToSend,
              };
              console.log(dataToUpdate)
            setLoading(true)
        dispatch(doUpdateVariable(dataToUpdate))
        .unwrap()
        .then((res) => {
          notificationController.success({
            message: t('device.deviceCreatedSuccesfullly'),
            // @ts-ignored
            description: `${t('device.createdNewDevice')}`,
          });
          setLoading(false);
          setOpen(false)
          setRecord(null)
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
          setLoading(false);
        });
        }
    }

    const onClickEdit = (record)=>{
        setRecord(record)
        setOpen(true)
    }

    const onCancel = (e) => {
        setOpen(false)
        setRecord(null)
    }


  return (
    <div>
      <Button onClick={()=>setOpen(!open)}>Add New Variable</Button>
      <S.TablesWrapper>
        <VariablesTable  onClickEdit={onClickEdit}/>
      </S.TablesWrapper>
      <CrudModal visible={open} onSave={onSave} loading={loading} onCancel={onCancel} record={record}/>
    </div>
  )
}

export default VariablePage

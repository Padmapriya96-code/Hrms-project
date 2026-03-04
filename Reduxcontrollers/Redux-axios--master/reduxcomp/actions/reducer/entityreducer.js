import { ADDENTITY,UPDATEENTITY,DELETEENTITY,VIEWBYID } from "../action"
const initialState=[]
export default function entityReducer(state=initialState,action)
{
        switch(action.type)
        {
            case ADDENTITY:
                state=action.payload
                return state
            case UPDATEENTITY:
                state=action.payload
                return state
            case DELETEENTITY:
                state=action.payload
            return state
            case VIEWBYID:

                state=action.payload
               /* state.map((e)=>{
                    console.log(e.employeeFirstName)
                })
               */
                return state
            default:
                return initialState

             
        }
}
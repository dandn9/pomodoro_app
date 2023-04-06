import produce from "immer";
import { PermanentState, permanentStore, PersistentData } from "../store/PermanentStore";
import { WritableDraft } from "immer/dist/internal";

type ParentReducer = (data: WritableDraft<PersistentData>) => any

/**
 * Decorates the setter function to instead of updating the instance, it updates the state to cause a rerender
 */
export function stateUpdater(parentReducer: ParentReducer = (data: WritableDraft<PersistentData>) => data, fn?: () => void) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        fn?.()
        const classAccessor = target.constructor.name.toLowerCase()
        descriptor.set = function (value: any) {
            console.log('setting', value)
            permanentStore().mutate((prevState) => produce(prevState, ((draft) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore XD without this it would become unreadable imo
                parentReducer(draft.data)[classAccessor][`_${propertyKey}`] = value



            })))
        }
    };
}
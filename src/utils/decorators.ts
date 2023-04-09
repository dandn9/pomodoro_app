import produce from "immer";
import { PermanentState, permanentStore, PermanentData } from "../store/PermanentStore";
import { WritableDraft } from "immer/dist/internal";

type ParentReducer = (data: WritableDraft<PermanentData>) => any

/**
 * Decorates the setter function to instead of updating the instance, it updates the state to cause a rerender
 */
export function stateUpdater(parentReducer: ParentReducer = (data) => data, fn?: () => void) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        fn?.()
        const classAccessor = target.constructor.name.toLowerCase()
        descriptor.set = function (value: any) {

            console.log('setting', value, this, classAccessor)
            permanentStore().mutate((prevState) => produce(prevState, ((draft) => {
                const reduced = parentReducer(draft.data)
                if (Array.isArray(reduced)) {
                    /** Every array element, its children should have - also if you pass a function from the decorator the _this_ context changes??? possible bug  */
                    reduced.find((v) => v.id === this.id)[`_${propertyKey}`] = value
                } else {
                    console.log(reduced, classAccessor)
                    reduced[classAccessor][`_${propertyKey}`] = value
                }
            })))
        }
    };
}
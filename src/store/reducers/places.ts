import { allIds, byId, choice } from 'services/transforms';
import { IPlace } from 'shared/places-api';
import { PlacesAction, PlacesActionType } from 'store/actions/places';

export interface IPlacesState {
    byId: {
        [id: string]: IPlace,
    } | null;
    error: Error | null;
    isPending: boolean;
    selectedPlace: IPlace | null;
    unusedIds: string[];
    usedIds: string[];
}

const defaultState: IPlacesState = {
    byId: null,
    error: null,
    isPending: false,
    selectedPlace: null,
    unusedIds: [],
    usedIds: [],
};

export default function(state: IPlacesState = defaultState, action: PlacesAction): IPlacesState {
    switch (action.type) {
        case PlacesActionType.CHOICE_PLACE:
            const places = Object.values(state.byId || {});

            return {
                ...state,
                selectedPlace: choice(action.payload.places || places),
            };

        case PlacesActionType.REQUEST_PLACES:
            return {
                ...state,
                isPending: true,
            };

        case PlacesActionType.REQUEST_PLACES_SUCCESS:
            return {
                ...state,
                byId: byId(action.payload.places),
                isPending: false,
                unusedIds: allIds(action.payload.places),
            };

        case PlacesActionType.REQUEST_PLACES_ERROR:
            return {
                ...state,
                error: action.payload.error,
                isPending: false,
            };
    }

    return state;
}

import 'react-native-get-random-values';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { saveContacts, getContacts } from './asyncStorageHelper';

export const mapContacts = (contact) => {
    const { name, picture, phone, cell, email } = contact;
    return {
        id: uuid(),
        name: name.first + ' ' + name.last,
        avatar: picture.large,
        phone,
        cell,
        email,
        favorite: Math.random() < 0.1 ? true : false,
    };
};

const contactsSlice = createSlice({
    name: 'contacts',
    initialState: {
        contacts: [],
        loading: false,
        error: null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        fetchContactsSuccess: (state, action) => {
            state.contacts = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateContactInStore: (state, action) => {
            const index = state.contacts.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.contacts[index] = action.payload;
            }
        },
        toggleFavorite: (state, action) => {
            const contact = state.contacts.find(c => c.id === action.payload);
            if (contact) {
                contact.favorite = !contact.favorite;
            }
        },
    },
});

export const {
    setLoading,
    setError,
    fetchContactsSuccess,
    updateContactInStore,
    toggleFavorite
} = contactsSlice.actions;

export const loadContacts = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));

        let contacts = await getContacts();

        if (contacts.length === 0) {
            const response = await fetch("https://randomuser.me/api/?results=50");
            const data = await response.json();
            contacts = data.results.map(mapContacts);

            await saveContacts(contacts);
        }

        dispatch(fetchContactsSuccess(contacts));
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
    }
};

export const updateContact = (contact) => async (dispatch, getState) => {
    try {
        dispatch(updateContactInStore(contact));

        const { contacts } = getState().contacts;
        await saveContacts(contacts);
    } catch (error) {
        console.error('Error updating contact:', error);
    }
};

export const toggleContactFavorite = (contactId) => async (dispatch, getState) => {
    try {
        dispatch(toggleFavorite(contactId));

        const { contacts } = getState().contacts;
        await saveContacts(contacts);
    } catch (error) {
        console.error('Error toggling favorite:', error);
    }
};

const store = configureStore({
    reducer: {
        contacts: contactsSlice.reducer,
    },
});

export default store;
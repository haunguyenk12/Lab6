import AsyncStorage from '@react-native-async-storage/async-storage';

const CONTACTS_KEY = '@contacts';

export const saveContacts = async (contacts) => {
    try {
        const jsonValue = JSON.stringify(contacts);
        await AsyncStorage.setItem(CONTACTS_KEY, jsonValue);
        return true;
    } catch (error) {
        console.error('Error saving contacts:', error);
        return false;
    }
};

export const getContacts = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(CONTACTS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Error getting contacts:', error);
        return [];
    }
};

export const clearContacts = async () => {
    try {
        await AsyncStorage.removeItem(CONTACTS_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing contacts:', error);
        return false;
    }
};

export const updateContact = async (updatedContact) => {
    try {
        const contacts = await getContacts();
        const index = contacts.findIndex(c => c.id === updatedContact.id);
        if (index !== -1) {
            contacts[index] = updatedContact;
            await saveContacts(contacts);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating contact:', error);
        return false;
    }
};

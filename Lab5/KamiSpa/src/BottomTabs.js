import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Home from './Home';
import Customer from './Customer';
import Transaction from './Transaction';
import Setting from './Setting';
const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Icon name="home" color={color} size={size} />
                ),
            }} />
            <Tab.Screen name="Transaction" component={Transaction} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Icon name="attach-money" color={color} size={size} />
                ),
            }} />
            <Tab.Screen name="Customer" component={Customer} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Icon name="supervised-user-circle" color={color} size={size} />
                ),
            }} />
            <Tab.Screen name="Setting" component={Setting} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Icon name="settings" color={color} size={size} />
                ),
            }} />
        </Tab.Navigator>
    );
}   
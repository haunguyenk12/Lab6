import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, PanResponder, Dimensions, StatusBar, Platform, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = 280;
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const CustomDrawer = ({ children, navigation, currentRoute }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isDrawerOpen ? 0 : -DRAWER_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [isDrawerOpen]);

    const closePanResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => isDrawerOpen,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.dx < -10 && isDrawerOpen;
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx < -50 || gestureState.vx < -0.3) {
                    closeDrawer();
                }
            },
        })
    ).current;

    const navigateTo = (routeName) => {
        setIsDrawerOpen(false);
        navigation.navigate(routeName);
    };

    const openDrawer = () => {
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <View style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
            <View style={styles.container}>
                {/* Header with menu icon */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={openDrawer}
                        style={styles.menuButton}
                    >
                        <Icon name="menu" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {currentRoute === 'Contacts' ? 'Contacts' : 'Favorites'}
                    </Text>
                </View>

                {/* Main content */}
                <View style={styles.content}>
                    {children}
                </View>

                {/* Drawer Modal */}
                <Modal
                    visible={isDrawerOpen}
                    transparent
                    animationType="none"
                    onRequestClose={closeDrawer}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalOverlay}>
                            <TouchableOpacity
                                style={styles.backdrop}
                                activeOpacity={1}
                                onPress={closeDrawer}
                            />
                            <Animated.View
                                style={[
                                    styles.drawer,
                                    {
                                        transform: [{ translateX: slideAnim }]
                                    }
                                ]}
                                {...closePanResponder.panHandlers}
                            >
                                <View style={styles.drawerHeader}>
                                    <Text style={styles.drawerHeaderText}>Menu</Text>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.drawerItem,
                                        currentRoute === 'Contacts' && styles.drawerItemActive
                                    ]}
                                    onPress={() => navigateTo('Contacts')}
                                >
                                    <Icon
                                        name="format-list-bulleted"
                                        size={24}
                                        color={currentRoute === 'Contacts' ? 'blue' : 'gray'}
                                    />
                                    <Text
                                        style={[
                                            styles.drawerItemText,
                                            currentRoute === 'Contacts' && styles.drawerItemTextActive
                                        ]}
                                    >
                                        Contacts
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.drawerItem,
                                        currentRoute === 'Favorites' && styles.drawerItemActive
                                    ]}
                                    onPress={() => navigateTo('Favorites')}
                                >
                                    <Icon
                                        name="star-check"
                                        size={24}
                                        color={currentRoute === 'Favorites' ? 'blue' : 'gray'}
                                    />
                                    <Text
                                        style={[
                                            styles.drawerItemText,
                                            currentRoute === 'Favorites' && styles.drawerItemTextActive
                                        ]}
                                    >
                                        Favorites
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: STATUS_BAR_HEIGHT,
    },
    container: {
        flex: 1,
    },
    header: {
        height: 56,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    menuButton: {
        padding: 8,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    modalOverlay: {
        flex: 1,
        flexDirection: 'row',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#fff',
        elevation: 16,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    drawerHeader: {
        height: 150,
        backgroundColor: '#6200ee',
        justifyContent: 'flex-end',
        padding: 20,
    },
    drawerHeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingLeft: 20,
    },
    drawerItemActive: {
        backgroundColor: '#f0f0f0',
    },
    drawerItemText: {
        fontSize: 16,
        marginLeft: 32,
        color: 'gray',
    },
    drawerItemTextActive: {
        color: 'blue',
        fontWeight: '600',
    },
});

export default CustomDrawer;

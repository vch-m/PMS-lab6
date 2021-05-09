import React from 'react';

import NameScreen from "../components/NameScreen";
import GraphScreen from "../components/GraphScreen";
import MovieScreen from "../components/MovieScreen";
import GalleryScreen from "../components/GalleryScreen";

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AddPoster from "../components/AddPoster";
import Info from "../components/Info";

const Stack = createStackNavigator();


const movieStackNavigator = () => {
    return(
        <Stack.Navigator initialRouteName="MovieScreen">
            <Stack.Screen name="Movies" component={MovieScreen} />
            <Stack.Screen name="Add Poster" component={AddPoster} />
            <Stack.Screen name="Information" component={Info} />
        </Stack.Navigator>
    )
}


const Tab = createBottomTabNavigator();

export default function AppNavigation() {
    return (
        <Tab.Navigator
            tabBarOptions={
                { labelStyle: { paddingBottom: 5 } }}
        >
            <Tab.Screen
                name="Name"
                component={NameScreen}
                options={{
                    tabBarLabel: 'Name',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="clipboard-account" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Graph"
                component={GraphScreen}
                options={{
                    tabBarLabel: 'Graph',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="chart-line-variant" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Movies"
                component={movieStackNavigator}
                options={{
                    tabBarLabel: 'Movies',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="video" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Pictures"
                component={GalleryScreen}
                options={{
                    tabBarLabel: 'Pictures',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="camera" color={color} size={size} />
                    ),
                }}

            />
        </Tab.Navigator>
    );
}

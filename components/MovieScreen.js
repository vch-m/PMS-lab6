import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, VirtualizedList, StyleSheet, Text, StatusBar, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
export let DATA = []


const window = Dimensions.get("window");
const screen = Dimensions.get("screen");


function getUniqueListBy(arr, key) {
    // filter object list from repetitions
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

const getItemCount = (data) => data.length;

const getItem = (data, index) => {
    return ({
        id: `${data[index].imdbID}`,
        title: `${data[index].Title}`,
        year: `${data[index].Year}`,
        type: `${data[index].Type}`,
        poster: `${data[index].Poster}`
    })
};

export default function MovieScreen({ navigation }) {

    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [dimensions, setDimensions] = useState({ window, screen });
    const [rerender, setRerender] = useState(false);

    const onChange = ({ window, screen }) => {
        setDimensions({ window, screen });
    };

    useEffect(() => {
        Dimensions.addEventListener("change", onChange);
        return () => {
            Dimensions.removeEventListener("change", onChange);
        };
    });

    const orientation = () => {
        if (dimensions.window.height >= dimensions.window.width) {
            return portrait
        } else {
            return landscape
        }
    }


    const LeftActions = () => {
        return (
            <View style={portrait.rightAction}>
                <Text style={portrait.actionText}>Delete</Text>
            </View>
        )
    }

    function Item({ id, title, year, type, poster }) {
    
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={
                    () => navigation.navigate('Information', {
                        fileName: id,
                        title: title,
                        year: year,
                    })

                }>
                <Swipeable
                    renderRightActions={LeftActions}
                    onSwipeableRightOpen={() => {
                        const obj = filteredDataSource.findIndex(elem => elem.imdbID === id)
                        filteredDataSource.splice(obj, 1);
                        setRerender(!rerender)
                    }

                    }
                >
                    <View style={portrait.item}>
                        <View style={portrait.posterViev}>
                            <Image
                                style={orientation().poster}
                                source={poster === 'N/A' ? require('../assets/posters/no-poster.jpg') : { uri: poster }}
                            />
                        </View>
                        <View style={orientation().textViev}>
                            <Text style={portrait.title}>{title}</Text>
                            <Text style={portrait.details}>{year}</Text>
                            <Text style={portrait.details}>{type}</Text>
                        </View>
                    </View>
                </Swipeable>
            </TouchableOpacity>
        )
    }


    const ItemSeparator = () => {
        return (
            <View
                style={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    backgroundColor: '#C8C8C8',
                    width: '92%',
                    height: 0.5,

                }}
            />
        );
    };
    
    
    const searchFilterFunction = async(text) => {

        const validText = text
            .toLowerCase()
            .replace(/[^a-zA-Z ]/g, "")
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/,/g, '')
    
        if (validText.length < 3) {
            setFilteredDataSource([])
        } else {
            let url = `http://www.omdbapi.com/?apikey=dbf1a99b&s=${validText}&page=1`;
            let response = await fetch(url)
                .then(loadedData => loadedData.json())
                .catch( error => {
                    console.log(error);
                })
                
            if (response.Search !== undefined) {
                setFilteredDataSource(getUniqueListBy(response.Search, 'imdbID'))
            } 
        }
    };
    
    return (
        <SafeAreaView style={portrait.container}>
            {
                React.useLayoutEffect(() => {
                    navigation.setOptions({
                        headerRight: () => (
                            <TouchableOpacity
                                activeOpacity={0.5}

                                onPress={() => {
                                    navigation.navigate('Add Poster');
                                }}
                            >
                                <MaterialCommunityIcons style={orientation().addIcon} name="plus" color={'#808082'} size={30} />
                            </TouchableOpacity>
                        ),
                    });
                }, [navigation])
            }
            <View style={portrait.sectionStyle}>
                <MaterialCommunityIcons style={portrait.imageStyle} name="magnify" color={'#808082'} size={26} />
                <TextInput
                    style={portrait.textInputStyle}
                    onChangeText={(text) =>
                        searchFilterFunction(text)}

                    underlineColorAndroid="transparent"
                    clearButtonMode={'while-editing'}
                />
            </View>

            <VirtualizedList
                data={filteredDataSource}
                ItemSeparatorComponent={ItemSeparator}
                renderItem={({ item }) => (
                    <Item id={item.id} title={item.title} year={item.year} type={item.type} poster={item.poster} />
                )}

                getItemCount={getItemCount}
                getItem={getItem}
            />

        </SafeAreaView>
    );
}


const portrait = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#fff',
    },

    item: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 'auto',
        justifyContent: 'center',
        marginHorizontal: 0,
        padding: 20,
    },

    title: {
        fontSize: 18,
    },

    poster: {
        width: 100,
        height: 170,
        borderRadius: 2,
        borderColor: 'white',
        borderWidth: 1,
    },

    posterViev: {
        flex: 2
    },

    textViev: {
        flex: 10,
        marginLeft: "20%",

    },


    details: {
        fontSize: 16,
        marginTop: 10,
        color: '#737373'
    },

    // Search style section

    textInputStyle: {
        flex: 1,
        height: 40,
        margin: 2,
        borderRadius: 10,
        
    },

    sectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D4D4D4',
        opacity: 0.6,

        height: 40,
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 10,
        marginBottom: 3,
    },

    imageStyle: {
        margin: 5,
        
    },

    // Text Styles (actually at Poster Info component)

    baseText: {
        color: '#949494',
        fontWeight: '600',
        fontSize: 15,

    },

    innerText: {
        color: 'black',
        fontWeight: '400',
    },

    infoScreen: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 40,
        backgroundColor: 'white'
    },

    infoImageSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',

        // shadow
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: {
            height: 0,
            width: 0,
        },
        elevation: 2,
    },

    infoImage: {
        width: 380,
        height: 600,

    },

    rightAction: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red',

    },

    actionText: {
        color: '#fff',
        padding: 20,
        textAlign: 'right'
    },

    addIcon: {
        textAlign: 'right',
        marginHorizontal: 16,
        marginBottom: 5,
        marginTop: 2,
        color: '#4F817F'
    }
});

const landscape = StyleSheet.create({
    textViev: {
        marginRight: "20%",
        flex: 10,
        marginLeft: "10%"
    },

    poster: {
        width: 100,
        height: 170,
        borderRadius: 2,
        borderColor: '#000',
        borderWidth: 1,
    },

    addIcon: {
        textAlign: 'right',
        marginHorizontal: 16,
        marginBottom: 5,
        marginTop: 2,
        color: '#4F817F'
    }
})

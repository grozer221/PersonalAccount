import {StyleSheet, View, Text} from 'react-native';
import {Link} from 'react-router-native';

export const NotFoundScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>This screen doesn't exist.</Text>
            <Link to={'/'} style={styles.link}>
                <Text style={styles.linkText}>Go to home screen!</Text>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});

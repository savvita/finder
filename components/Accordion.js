import { ScrollView } from 'react-native';

const Accordion = ({ children }) => {
    return (
        <ScrollView>
            { children }
        </ScrollView>
    );
}

export default Accordion;
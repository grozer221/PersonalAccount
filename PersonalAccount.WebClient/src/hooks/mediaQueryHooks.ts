import {useMediaQuery} from 'react-responsive';

export const useIsPhone = () => useMediaQuery({query: '(max-width: 900px)'})

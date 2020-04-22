import * as React from 'react';
import { useOlMap } from './useOlMap';
import { MapEvent } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';

export interface IUseViewHistoryProps {
    pwet?: any;
};

export function useViewHistory(props: IUseViewHistoryProps) {
    const olMap = useOlMap();
    const [currentExtent, setCurrentExtent] = React.useState<Extent>(olMap.getView().calculateExtent());
    const [pastExtends, setPastExtends] = React.useState<Extent[]>([]);
    const [futureExtends, setFutureExtends] = React.useState<Extent[]>([]);

    const onMoveEnd = ( evt: MapEvent) => {
        const { frameState } = evt;
        if (frameState.extent !== currentExtent) {
            console.log('New Extent', currentExtent, frameState.extent);
            
            setPastExtends([...pastExtends, currentExtent]);
            setCurrentExtent(frameState.extent);
            setFutureExtends([]);
        }
    };


    React.useEffect(() => {
        olMap.on('moveend', onMoveEnd);
        return () => {
            olMap.un('moveend', onMoveEnd); 
        };
    }, []);

    const onFitEnd = () => {
        const newPastExtends = [ ...pastExtends ];
        const newExtent = newPastExtends.pop();
        const newFutureExtends = [ currentExtent, ...futureExtends ]

        setPastExtends(newPastExtends);
        setCurrentExtent(newExtent);
        setFutureExtends(newFutureExtends);
    };
    
    const fitToPrevious = () => {
        if ( pastExtends.length > 0) {
            olMap.un('moveend', onMoveEnd);

            olMap.getView().fit(pastExtends[pastExtends.length - 1], {
                callback: onFitEnd
            });  
        }
    }

    return [fitToPrevious];
}

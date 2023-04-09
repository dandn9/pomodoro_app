import React, { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Session } from '../../utils/classes';
import SessionItem from './SessionItem';
import usePermanentStore from '@/store/PermanentStore';

export type DragSessionTypeData = {
    id: number;
    sessionId: number;
    order: number;
    type: 'task' | 'session';
};

const SessionList: React.FC<{
    onEdit: (session: Session) => void;
}> = ({ onEdit }) => {
    const sessions = usePermanentStore((state) => state.data.sessions.sessions)
    console.log('session list render')
    const [accordionValue, setAccordionValue] = useState<string[]>([]);

    return (
        <Accordion.Root type="multiple" onValueChange={(val) => setAccordionValue(val)} value={accordionValue}>
            {sessions.map((session, index) => (
                <SessionItem
                    session={session}
                    key={session.id}
                    id={session.id}
                    onEdit={onEdit}
                    index={index}
                />
            ))}
        </Accordion.Root>
    );
};
export default SessionList;

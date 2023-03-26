import React, { startTransition } from 'react';
import SessionItem from '../components/sessions/SessionItem';
import useAppStore from '../hooks/useTempStore';
import useStateStore from '../store/PermanentStore';
import Modal from '../components/UI/Modal';
import SessionModalContent from '../components/sessions/NewSessionModalContent';
import EditSessionModalContent from '../components/sessions/EditSessionModalContent';
import { Session } from '../utils/classes';
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import SessionList from '../components/sessions/SessionList';

const Sessions = () => {
    const [editOpen, setEditOpen] = React.useState(false);
    const [editSession, setEditSession] = React.useState<Session | undefined>(
        undefined
    );
    const sessionsData = useStateStore((state) => state.data.sessions);

    function onEdit(session: Session) {
        startTransition(() => {
            setEditSession(session);
            setEditOpen(true);
        });
    }
    function onEditClose() {
        startTransition(() => {
            setEditSession(undefined);
            setEditOpen(false);
        });
    }

    return (
        <div className="relative">
            <CreateSessionModal />
            <SessionEditModal
                isOpen={editOpen}
                onEditClose={onEditClose}
                setIsOpen={setEditOpen}
                session={editSession}
            />

            <SessionList sessions={sessionsData} onEdit={onEdit} />
        </div>
    );
};
export default Sessions;

const SessionEditModal: React.FC<{
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onEditClose: () => void;
    session: Session | undefined;
}> = ({ isOpen, setIsOpen, session, onEditClose }) => {
    return (
        <Modal setOpen={setIsOpen} open={isOpen}>
            <EditSessionModalContent
                onEditClose={onEditClose}
                session={session}
                setOpen={setIsOpen}
            />
        </Modal>
    );
};

const CreateSessionModal = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <>
            <button onClick={() => setIsOpen(true)} className="w-full ">
                Create Session
            </button>
            <Modal open={isOpen} setOpen={setIsOpen}>
                <SessionModalContent setOpen={setIsOpen} />
            </Modal>
        </>
    );
};

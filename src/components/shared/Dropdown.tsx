import { Menu, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import clsx from 'clsx';

interface DropdownProps {
    button: ReactNode;
    children: ReactNode;
    menuWidth?: string;
}

export const Dropdown = ({ button, children, menuWidth = 'w-56' }: DropdownProps) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button as="div">{button}</Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className={clsx(
                        'absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                        menuWidth
                    )}
                >
                    {children}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

// Component con để style các item
export const DropdownMenuItem = ({ children, onClick }: { children: ReactNode, onClick?: () => void }) => {
    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    onClick={onClick}
                    className={clsx(
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                        active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    )}
                >
                    {children}
                </button>
            )}
        </Menu.Item>
    )
}
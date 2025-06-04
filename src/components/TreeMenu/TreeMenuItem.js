import React, { useEffect } from 'react';

/*
	This component is responsible for displaying the folder in the TreeMenu list.
	It can be used to customise the folder to be displayed or to display the default option

*/
export const TreeMenuFolder = ({
	level = 0, hasNodes, isOpen,
	label, toggleNode, focused, parent, active, type, isDisabled,
	folder, folderIcon, setSavedOpenNodes, openNodes, ...props
}) => {
	const selected = (focused || active) ? ' selected' : '';
	const disabled = isDisabled ? ' disabled' : '';
	const paddingLeft = 1.25 * level + 0.5;

	// Saving open nodes
	useEffect(() => {
		setSavedOpenNodes(openNodes);
	}, [openNodes]);

	// Method to manage clicks on whole rows of the Tree item
	const handleClick = (e) => {
		e.stopPropagation();
		hasNodes && toggleNode && toggleNode();
	}

	// If the folder is not configured, the default will be displayed
	if (folder == undefined) {
		folder = DefaultItem;
	}

	// If the icon is not configured, the default will be displayed
	if (folderIcon == undefined) {
		folderIcon = () => <DefaultToggleFolderIcon isOpen={isOpen} selected={selected} />;
	}

	return (
		<li
			className={`tree-menu-item${selected}${disabled} position-relative`}
			onClick={e => {handleClick(e)}}
			style={{ paddingLeft: `${paddingLeft}rem`, display: 'flex' }}
		>
			{/*
					folderIcon - is a render method that returns a custom icons for folder

					It returns the props that can be used in this method:
					selected - string "selected" or ""
					isOpen - bool, true or false
			*/}
			{folderIcon(isOpen, selected)}
			{/*
				folder - is a render method that returns a custom defined element for folders

				It returns the props that can be used in this method:
				label - string, value required to display the contents of the row (e.g. folder name)
				type - string "folder" or "file"
				isDisabled - bool, true or false
			*/}
			{folder(label, parent, type, isDisabled, level)}
		</li>
	);
};

/*
	This component is responsible for displaying the file in the TreeMenu list.
	It can be used to customise the file to be displayed or to display the default option

*/
export const TreeMenuFile = ({
	level = 0,
	label, searchTerm, active,
	matchSearch, focused, parent, type, isDisabled,
	file, fileIcon, ...props
}) => {
	const selected = (focused || active) ? ' selected' : '';
	const disabled = isDisabled ? ' disabled' : '';
	const paddingLeft = 1.25 * level + 0.5;

	if (file === 'hidden') {
		return null;
	}

	// If the file is not configured, the default will be displayed
	if (file == undefined) {
		file = DefaultItem;
	}

	// If the icon is not configured, the default will be displayed
	if (fileIcon == undefined) {
		fileIcon = DefaultFileIcon;
	}

	return (
		<li
			className={`tree-menu-item${selected}${disabled} position-relative`}
			style={{ paddingLeft: `${paddingLeft}rem`, display: 'flex' }}
		>
			{/*fileIcon - is a render method that returns a custom icons for file*/}
			{fileIcon()}
			{/*
				file - is a render method that returns a custom defined element for files

				It returns the props that can be used in this method:
				label - string, value required to display the contents of the row
				parent -  string, value that contains the name of the folder to which the item belongs
				type - string "folder" or "file"
				isDisabled - bool, true or false
			*/}
			{file(label, parent, type, isDisabled, level)}
		</li>
	);
};

const DefaultItem = (label) => {
	return	(
		<span>{label}</span>
	);
}
const DefaultToggleFolderIcon = ({ isOpen, selected }) => {
	return (
		<i className={`${selected} ${isOpen ? 'bi bi-folder-fill' : 'bi bi-folder'} me-2`} />
	)
};

const DefaultFileIcon = () => {
	return (
		<i className='bi bi-file-earmark me-2'/>
	)
};

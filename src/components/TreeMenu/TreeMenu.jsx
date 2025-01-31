import React from 'react';
import { List, Input } from 'reactstrap';
import SimpleTreeMenu from 'react-simple-tree-menu';
import { useTranslation } from 'react-i18next';

import { TreeMenuFolder, TreeMenuFile } from './TreeMenuItem';

export const TreeMenu = ({
	data, isLoading, limit, folder, folderIcon, file, fileIcon, hasSearch, savedOpenNodes, setSavedOpenNodes, ...props
}) => {
	const { t } = useTranslation();

	return (
		<div className='tree-menu'>
			{isLoading ?
				<div className='placeholder-glow'>
					{Array.from({ length: limit }, (_, idx) => (
						<span key={idx} className='placeholder w-100 bg-secondary' />
					))}
				</div>
			:
				<SimpleTreeMenu
					data={data}
					initialOpenNodes={savedOpenNodes}
					{...props}
				>
					{({ search, items }) => (
						<>
							{hasSearch &&
								<Input
									onChange={e => search(e.target.value)}
									placeholder={t('General|Search')}
									name='search'
								/>}
							<List className='m-0' type='unstyled'>
								{items.map(({ reset, type, parent, openNodes, ...params }) => (
									type === 'folder' ?
										<TreeMenuFolder
											parent={parent}
											folder={folder}
											folderIcon={folderIcon}
											type={type}
											openNodes={openNodes}
											setSavedOpenNodes={setSavedOpenNodes}
											{...params}
										/>
									:
										<TreeMenuFile
											parent={parent}
											file={file}
											fileIcon={fileIcon}
											type={type}
											{...params}
										/>
								))}
							</List>
						</>
					)}
				</SimpleTreeMenu>
			}
		</div>
	);
}

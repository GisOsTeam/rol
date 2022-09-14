import { SearchContent, ISearchContentProps } from './search/SearchContent';
import { withBaseTool, IBaseToolProps } from './BaseTool';

export type ISearchProps = IBaseToolProps & Partial<ISearchContentProps>;

export const Search = withBaseTool(SearchContent, { className: 'search' });

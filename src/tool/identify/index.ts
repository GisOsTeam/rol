import { Button } from './Button';
import { Content } from './Content';
import { Header } from './Header';
import { withBaseWindowTool } from '../BaseWindowTool';

export const Identify = withBaseWindowTool(Content, Header, Button);
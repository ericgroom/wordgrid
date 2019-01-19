import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import fetchMock from "jest-fetch-mock";
import "./test_utils";

global.fetch = fetchMock;
configure({ adapter: new Adapter() });

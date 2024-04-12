import EnhancedTable from "../components/Table"
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';

const Leads = () => {
    return (
        <div className="mt-10 mx-10 ">
            <div className="flex justify-between">
                <h1 className="text-2xl mb-3">Manage Leads</h1>
                <div className="max-w-[280px] w-full lg:hidden">
                    <div className="bg-red-800 w-[100%] text-white px-4 py-2 hover:bg-red-700 cursor-pointer">
                        <FileCopyOutlinedIcon className="h-[1px] w-[10px] mr-2 text-sm" style={{ fontSize: "20px" }} />
                        Import Leads
                    </div>
                </div>
            </div>
            <hr />
            <div className="mt-5 flex justify-between">
                <EnhancedTable />
                <div className="max-w-[280px] ml-4 mt-10 w-full hidden lg:block">
                    <div className="bg-red-800 w-[100%] text-white px-4 py-2 hover:bg-red-700 cursor-pointer">
                        <FileCopyOutlinedIcon className="h-[1px] w-[10px] mr-2 text-sm" style={{ fontSize: "20px" }} />
                        Import Leads
                    </div>
                    <div className="bg-red-800 w-[100%] text-white px-4 py-2 hover:bg-red-700 cursor-pointer mt-3">
                        <FileCopyOutlinedIcon className="h-[1px] w-[10px] mr-2 text-sm" style={{ fontSize: "20px" }} />
                        Add New Lead
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Leads

export const InputField = ({ field, type, onChange, value1 }) => {
    return (
        <div className='flex items-center justify-between mx-3 my-2'>
            <p>{field}<span className='text-red-800 font-bold mr-3 ml-1'>*</span></p>
            <input className="w-[250px] outline-none text-black text-sm px-2 h-[40px]" style={{ border: "1px solid #ccc" }} type={type} placeholder={field} onChange={onChange} value={value1} />
        </div>
    )
}

export const SelectField = ({ searchList, searchTerm, type, onChange }) => {
    return (
        <div className='flex items-center justify-between mx-3 my-2'>
            <p>{type}<span className='text-red-800 font-bold mr-3 ml-1'>*</span></p>
            <select className="w-[250px] outline-none text-black text-sm px-2 h-[40px]"
                style={{ border: "1px solid #ccc" }} onChange={onChange}>
                <option value='' key='' disabled selected={searchTerm === ""}>Select</option>
                {
                    searchList.map((Item) => {
                        return <option value={Item} key={Item} selected={Item === searchTerm}>{Item}</option>
                    })
                }
            </select>
        </div>
    )
}
import React from 'react'

const ComposeMailForm = () => {
    return (
        <>
            <div className="position-relative border-bottom">
                <div className="px-2 d-flex align-items-center">
                    <div className="p-0 w-100">
                        <input
                            className="form-control border-0"
                            type="text"
                            placeholder="Template Name"
                        />
                    </div>
                </div>
            </div>
            <div className="px-3 w-100 d-flex align-items-center border-bottom">
                <input 
                    className="form-control border-0 my-1 w-100 shadow-none" 
                    type="text" 
                    placeholder="Subject" 
                />
            </div>
        </>
    )
}

export default ComposeMailForm
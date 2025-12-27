import Header from "@/app/components/layout/Header"

const page = () => {
  return (
  <div className="flex flex-col min-h-screen sudo">
      <Header
        title="Dashboard"
        breadCrumbs={[
          { label: "General", to: "/sudo/dashboard/general/home" },
          { label: "Dashboard", to: "/sudo/dashboard/general/home" },
        ]}
        showSearch
        // actions={
        //  <Button 
        //  label="+ Add Product"
        //  primary
        //  onClick={() => {}}
        //  />
        // }
      />

      <div className="flex-1 p-6">

             </div>
    </div>
  )
}

export default page

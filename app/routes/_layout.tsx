import * as tsr from '@tanstack/react-router';

export const Route = tsr.createFileRoute('/_layout')({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="p-2">
      <div>I'm a layout</div>
      <div>
        <tsr.Outlet />
      </div>
    </div>
  );
}

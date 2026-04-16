import { CategoryList } from '../components/CategoryList';
import { CoreValuesDisplay } from '../components/CoreValuesDisplay';
import { StepWizard, type StepConfig } from '../components/StepWizard';
import { useAppContext } from '../context/AppContext';

type Props = {
  mode?: 'setup' | 'edit';
};

const STEPS: StepConfig[] = [
  { key: 'greeting' },
  { key: 'values' },
  { key: 'build' },
  { key: 'shape' },
  { key: 'workWith' },
  { key: 'summary' },
];

export function SetupScreen({ mode = 'setup' }: Props) {
  const {
    coreValues,
    missionItems,
    activeCycle,
    addCoreValue,
    updateCoreValue,
    deleteCoreValue,
    addMissionItem,
    updateMissionItem,
    toggleMissionItemActive,
    deleteMissionItem,
  } = useAppContext();

  const lockedItemIds = activeCycle
    ? [activeCycle.buildItemId, activeCycle.shapeItemId, activeCycle.workWithItemId]
    : [];

  const buildItems = missionItems.filter((i) => i.category === 'build');
  const shapeItems = missionItems.filter((i) => i.category === 'shape');
  const workWithItems = missionItems.filter((i) => i.category === 'workWith');

  const hasBuild = buildItems.some((i) => i.isActive);
  const hasShape = shapeItems.some((i) => i.isActive);
  const hasWorkWith = workWithItems.some((i) => i.isActive);

  const steps: StepConfig[] = [
    { key: 'greeting' },
    { key: 'values', canAdvance: coreValues.length > 0 },
    { key: 'build', canAdvance: hasBuild },
    { key: 'shape', canAdvance: hasShape },
    { key: 'workWith', canAdvance: hasWorkWith },
    { key: 'summary' },
  ];

  const renderStep = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="step-greeting">
            <h2 className="greeting-title">
              {mode === 'setup' ? 'Welcome to Indiva' : 'Edit Your Model'}
            </h2>
            <p className="greeting-sub">
              {mode === 'setup'
                ? 'Build your personal weekly mission system. Start by defining who you want to be.'
                : 'Refine your values and missions. Changes take effect on your next cycle.'}
            </p>
          </div>
        );

      case 1:
        return (
          <div className="step-section">
            <CoreValuesDisplay
              editable
              onAdd={addCoreValue}
              onDelete={deleteCoreValue}
              onEdit={updateCoreValue}
              values={coreValues}
            />
            {coreValues.length === 0 && (
              <p className="step-hint">Add at least one core value to continue.</p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="step-section">
            <CategoryList
              description="Things you can actively develop through practice, attention, and repetition."
              items={buildItems}
              lockedItemIds={lockedItemIds}
              onAdd={(text) => addMissionItem('build', text)}
              onDelete={deleteMissionItem}
              onEdit={updateMissionItem}
              onToggleActive={toggleMissionItemActive}
              title="Build"
            />
            {!hasBuild && (
              <p className="step-hint">Add at least one active Build mission to continue.</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="step-section">
            <CategoryList
              description="Things you can influence gradually through effort, structure, and patience."
              items={shapeItems}
              lockedItemIds={lockedItemIds}
              onAdd={(text) => addMissionItem('shape', text)}
              onDelete={deleteMissionItem}
              onEdit={updateMissionItem}
              onToggleActive={toggleMissionItemActive}
              title="Shape"
            />
            {!hasShape && (
              <p className="step-hint">Add at least one active Shape mission to continue.</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="step-section">
            <CategoryList
              description="Things you cannot fully control, but can meet with steadiness and skill."
              items={workWithItems}
              lockedItemIds={lockedItemIds}
              onAdd={(text) => addMissionItem('workWith', text)}
              onDelete={deleteMissionItem}
              onEdit={updateMissionItem}
              onToggleActive={toggleMissionItemActive}
              title="Work With"
            />
            {!hasWorkWith && (
              <p className="step-hint">Add at least one active Work With mission to continue.</p>
            )}
          </div>
        );

      case 5:
        return (
          <div className="step-greeting">
            <h2 className="greeting-title">
              {mode === 'setup' ? "You're ready" : 'Model updated'}
            </h2>
            <p className="greeting-sub">
              {coreValues.length} value{coreValues.length !== 1 ? 's' : ''} ·{' '}
              {buildItems.filter((i) => i.isActive).length} build ·{' '}
              {shapeItems.filter((i) => i.isActive).length} shape ·{' '}
              {workWithItems.filter((i) => i.isActive).length} work with
            </p>
            <p className="greeting-sub">
              {mode === 'setup'
                ? "Select your first weekly mission when you're ready."
                : 'Return to the workflow to continue your cycle.'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="screen">
      <StepWizard
        completeLabel={mode === 'setup' ? 'Start Using Indiva' : 'Done'}
        renderStep={renderStep}
        steps={steps}
      />
    </section>
  );
}
